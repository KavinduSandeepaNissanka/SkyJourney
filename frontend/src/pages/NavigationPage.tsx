import { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Divider,
  Avatar,
  Chip,
} from '@mui/material';
import { Map as MapIcon, Navigation, DirectionsWalk, LocalAirport, LocationOn, Clear, Route } from '@mui/icons-material';

interface MapNode {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'service' | 'gate' | 'lounge' | 'claim';
  description: string;
}

const mapNodes: MapNode[] = [
  { id: 'Check-In Desk', name: 'Check-In Desk', x: 120, y: 380, type: 'service', description: 'Main hall check-in desks and bag drop' },
  { id: 'Security Control', name: 'Security Control', x: 260, y: 380, type: 'service', description: 'TSA security screening area' },
  { id: 'Duty Free Area', name: 'Duty Free Area', x: 420, y: 260, type: 'service', description: 'Central concourse, shops and dining' },
  { id: 'Gate 1', name: 'Gate 1', x: 380, y: 410, type: 'gate', description: 'Domestic flights, Pier A' },
  { id: 'Gate 4', name: 'Gate 4', x: 700, y: 140, type: 'gate', description: 'International flights, Pier B' },
  { id: 'Gate 10', name: 'Gate 10', x: 700, y: 380, type: 'gate', description: 'Domestic departures, Pier C' },
  { id: 'Sky Club Lounge', name: 'Sky Club Lounge', x: 560, y: 90, type: 'lounge', description: 'Premium business class lounge' },
  { id: 'Baggage Carousel 4', name: 'Baggage Carousel 4', x: 560, y: 260, type: 'claim', description: 'Baggage reclaim carousel 4' },
];

interface Edge { to: string; weight: number; }

const graph: Record<string, Edge[]> = {
  'Check-In Desk': [{ to: 'Security Control', weight: 150 }],
  'Security Control': [
    { to: 'Check-In Desk', weight: 150 },
    { to: 'Duty Free Area', weight: 180 },
    { to: 'Gate 1', weight: 160 }
  ],
  'Duty Free Area': [
    { to: 'Security Control', weight: 180 },
    { to: 'Sky Club Lounge', weight: 250 },
    { to: 'Gate 4', weight: 320 },
    { to: 'Baggage Carousel 4', weight: 150 }
  ],
  'Gate 1': [
    { to: 'Security Control', weight: 160 },
    { to: 'Gate 10', weight: 300 }
  ],
  'Gate 4': [
    { to: 'Duty Free Area', weight: 320 },
    { to: 'Sky Club Lounge', weight: 180 }
  ],
  'Gate 10': [
    { to: 'Gate 1', weight: 300 },
    { to: 'Baggage Carousel 4', weight: 210 }
  ],
  'Sky Club Lounge': [
    { to: 'Duty Free Area', weight: 250 },
    { to: 'Gate 4', weight: 180 }
  ],
  'Baggage Carousel 4': [
    { to: 'Duty Free Area', weight: 150 },
    { to: 'Gate 10', weight: 210 }
  ]
};

const dijkstra = (start: string, end: string): string[] => {
  const distances: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const queue: string[] = [];
  Object.keys(graph).forEach(node => { distances[node] = Infinity; prev[node] = null; queue.push(node); });
  distances[start] = 0;
  while (queue.length > 0) {
    queue.sort((a, b) => distances[a] - distances[b]);
    const u = queue.shift()!;
    if (u === end) break;
    if (distances[u] === Infinity) break;
    for (const edge of graph[u]) {
      if (!queue.includes(edge.to)) continue;
      const alt = distances[u] + edge.weight;
      if (alt < distances[edge.to]) { distances[edge.to] = alt; prev[edge.to] = u; }
    }
  }
  const path: string[] = [];
  let curr: string | null = end;
  while (curr !== null) { path.unshift(curr); curr = prev[curr]; }
  return path[0] === start ? path : [];
};

const nodeTypeColors: Record<string, string> = {
  service: '#00D4FF',
  gate: '#F0C040',
  lounge: '#A78BFA',
  claim: '#4ADE80',
};

const NavigationPage = () => {
  const [startPoint, setStartPoint] = useState('Check-In Desk');
  const [endPoint, setEndPoint] = useState('Gate 4');
  const [routeCalculated, setRouteCalculated] = useState(false);
  const [path, setPath] = useState<string[]>([]);
  const [distance, setDistance] = useState(0);
  const [walkingTime, setWalkingTime] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const calculateRoute = (start: string, end: string) => {
    if (!start || !end || start === end) return;
    const computedPath = dijkstra(start, end);
    setPath(computedPath);
    let totalDist = 0;
    for (let i = 0; i < computedPath.length - 1; i++) {
      const edge = graph[computedPath[i]]?.find(e => e.to === computedPath[i + 1]);
      if (edge) totalDist += edge.weight;
    }
    setDistance(totalDist);
    setWalkingTime(Math.max(1, Math.round(totalDist / 80)));
    setRouteCalculated(true);
  };

  const handleClearRoute = () => { setRouteCalculated(false); setPath([]); setDistance(0); setWalkingTime(0); };

  const handleNodeClick = (nodeId: string) => {
    if (startPoint === nodeId) return;
    if (routeCalculated) { setStartPoint(nodeId); setEndPoint(''); handleClearRoute(); }
    else if (!startPoint) setStartPoint(nodeId);
    else if (!endPoint) { setEndPoint(nodeId); calculateRoute(startPoint, nodeId); }
    else { setStartPoint(nodeId); setEndPoint(''); }
  };

  const getSvgPathString = () => {
    if (path.length === 0) return '';
    return path.map(nodeId => { const node = mapNodes.find(n => n.id === nodeId); return node ? `${node.x},${node.y}` : ''; })
      .filter(c => c !== '').map((c, i) => (i === 0 ? `M ${c}` : `L ${c}`)).join(' ');
  };

  const getDirectionsList = () => {
    const dirs = [];
    for (let i = 0; i < path.length - 1; i++) {
      const u = path[i]; const v = path[i + 1];
      const edge = graph[u]?.find(e => e.to === v);
      const dist = edge ? edge.weight : 0;
      if (i === 0) dirs.push({ text: `Start at ${u}`, detail: `Head towards ${v} (${dist}m)`, icon: 'start' });
      else if (i === path.length - 2) dirs.push({ text: `Arrive at ${v}`, detail: `Final destination (${dist}m)`, icon: 'end' });
      else dirs.push({ text: `Pass ${u}`, detail: `Continue to ${v} (${dist}m)`, icon: 'mid' });
    }
    return dirs;
  };

  return (
    <Box className="animate-slideup">

      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: 46, height: 46, borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(74,222,128,0.15), rgba(74,222,128,0.06))',
            border: '1px solid rgba(74,222,128,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(74,222,128,0.1)',
          }}>
            <MapIcon sx={{ color: '#4ADE80', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#F0F4FF', lineHeight: 1 }}>
              Airport Navigation
            </Typography>
            <Typography sx={{ color: '#8BA3C7', fontSize: '0.85rem', mt: 0.3 }}>
              Indoor pathfinding with Dijkstra's shortest-path routing
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>

        {/* ── Route Planner Panel ──────────────────────────────── */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, border: '1px solid rgba(74,222,128,0.15)' }}>
            <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#F0F4FF', mb: 0.5 }}>
              Pathfinder Router
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#4A6080', mb: 3 }}>
              Select origin & destination or click map nodes
            </Typography>

            <TextField
              id="nav-start"
              select fullWidth
              label="Start Location"
              value={startPoint}
              onChange={(e) => { setStartPoint(e.target.value); if (routeCalculated) handleClearRoute(); }}
              margin="dense" size="small"
            >
              {mapNodes.map((n) => (
                <MenuItem key={n.id} value={n.id} disabled={n.id === endPoint}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: nodeTypeColors[n.type] }} />
                    {n.name}
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="nav-end"
              select fullWidth
              label="Destination"
              value={endPoint}
              onChange={(e) => { setEndPoint(e.target.value); if (routeCalculated) handleClearRoute(); }}
              margin="dense" size="small"
            >
              {mapNodes.map((n) => (
                <MenuItem key={n.id} value={n.id} disabled={n.id === startPoint}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: nodeTypeColors[n.type] }} />
                    {n.name}
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: 'flex', gap: 1, mt: 2.5 }}>
              <Button
                id="nav-find-route-btn"
                fullWidth variant="contained" color="secondary"
                startIcon={<Route />}
                onClick={() => calculateRoute(startPoint, endPoint)}
                disabled={!startPoint || !endPoint || startPoint === endPoint}
                sx={{ py: 1.3, fontWeight: 800 }}
              >
                Find Route
              </Button>
              {routeCalculated && (
                <Button onClick={handleClearRoute} color="error" variant="outlined"
                  sx={{ minWidth: 48, borderRadius: '12px' }}>
                  <Clear />
                </Button>
              )}
            </Box>

            {/* Route Result */}
            {routeCalculated && path.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Divider sx={{ borderColor: 'rgba(0,212,255,0.06)', mb: 2.5 }} />

                {/* Distance/Time card */}
                <Box sx={{
                  p: 2, borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(74,222,128,0.08), rgba(74,222,128,0.02))',
                  border: '1px solid rgba(74,222,128,0.2)',
                  mb: 3,
                }}>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.3 }}>
                        <DirectionsWalk sx={{ color: '#4ADE80', fontSize: 16 }} />
                        <Typography sx={{ fontSize: '0.65rem', color: '#3A5070', fontWeight: 700, letterSpacing: 1 }}>WALK</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#4ADE80', lineHeight: 1 }}>
                        {walkingTime}min
                      </Typography>
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.3 }}>
                        <Route sx={{ color: '#00D4FF', fontSize: 16 }} />
                        <Typography sx={{ fontSize: '0.65rem', color: '#3A5070', fontWeight: 700, letterSpacing: 1 }}>DISTANCE</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#00D4FF', lineHeight: 1 }}>
                        {distance}m
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Turn-by-turn directions */}
                <Typography sx={{ fontSize: '0.65rem', color: '#3A5070', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', mb: 1.5 }}>
                  Turn-by-Turn
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {getDirectionsList().map((dir, idx) => (
                    <Box key={idx} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      <Avatar sx={{
                        width: 28, height: 28, borderRadius: '8px', flexShrink: 0,
                        bgcolor: dir.icon === 'start' ? 'rgba(74,222,128,0.12)' : dir.icon === 'end' ? 'rgba(244,63,94,0.12)' : 'rgba(0,212,255,0.08)',
                        color: dir.icon === 'start' ? '#4ADE80' : dir.icon === 'end' ? '#F43F5E' : '#00D4FF',
                      }}>
                        {dir.icon === 'start' ? <LocationOn sx={{ fontSize: 14 }} /> :
                         dir.icon === 'end' ? <LocalAirport sx={{ fontSize: 14 }} /> :
                         <Navigation sx={{ fontSize: 14, transform: 'rotate(45deg)' }} />}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#F0F4FF', lineHeight: 1.2 }}>
                          {dir.text}
                        </Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: '#4A6080' }}>
                          {dir.detail}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Card>
        </Grid>

        {/* ── Interactive Map ─────────────────────────────────── */}
        <Grid item xs={12} md={8}>
          <Card sx={{ border: '1px solid rgba(0,212,255,0.12)', overflow: 'hidden' }}>
            {/* Map Header */}
            <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,212,255,0.06)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <MapIcon sx={{ color: '#00D4FF', fontSize: 20 }} />
                <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#F0F4FF' }}>
                  Interactive Terminal Map
                </Typography>
              </Box>
              {hoveredNode && (
                <Chip
                  size="small"
                  label={`${hoveredNode}: ${mapNodes.find(n => n.id === hoveredNode)?.description}`}
                  sx={{
                    bgcolor: 'rgba(0,212,255,0.08)', color: '#00D4FF',
                    border: '1px solid rgba(0,212,255,0.2)',
                    fontWeight: 600, fontSize: '0.68rem', maxWidth: 350,
                  }}
                />
              )}
            </Box>

            {/* SVG Map */}
            <Box sx={{ position: 'relative', background: 'linear-gradient(135deg, #040B14, #060E1F, #091524)', minHeight: 460, overflow: 'hidden' }}>
              <svg viewBox="0 0 800 450" width="100%" height="100%" style={{ display: 'block', minHeight: 460 }}>
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 212, 255, 0.04)" strokeWidth="0.5" />
                  </pattern>
                  <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4ADE80" />
                    <stop offset="100%" stopColor="#00D4FF" />
                  </linearGradient>
                </defs>

                <style>{`
                  @keyframes pathFlow { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
                  .animated-path { animation: pathFlow 1s linear infinite; }
                  @keyframes pulseNode { 0% { r: 8; opacity: 0.8; } 80% { r: 22; opacity: 0; } 100% { r: 8; opacity: 0; } }
                  .pulse-ring { animation: pulseNode 2s infinite; }
                `}</style>

                {/* Grid */}
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Terminal zones */}
                <rect x="50" y="50" width="700" height="350" rx="16" fill="none" stroke="rgba(0,212,255,0.08)" strokeWidth="1" strokeDasharray="4 4" />
                <rect x="70" y="320" width="230" height="70" rx="12" fill="rgba(0,212,255,0.03)" stroke="rgba(0,212,255,0.1)" strokeWidth="1" />
                <text x="90" y="340" fill="rgba(139,163,199,0.3)" fontSize="9" fontWeight="bold" fontFamily="Outfit">MAIN TICKETING HALL</text>
                <rect x="340" y="220" width="160" height="170" rx="12" fill="rgba(0,212,255,0.03)" stroke="rgba(0,212,255,0.1)" strokeWidth="1" />
                <text x="360" y="240" fill="rgba(139,163,199,0.3)" fontSize="9" fontWeight="bold" fontFamily="Outfit">CONCOURSE CENTRAL</text>
                <rect x="650" y="80" width="80" height="300" rx="12" fill="rgba(240,192,64,0.02)" stroke="rgba(240,192,64,0.08)" strokeWidth="1" />
                <text x="670" y="100" fill="rgba(240,192,64,0.2)" fontSize="9" fontWeight="bold" fontFamily="Outfit" transform="rotate(90,670,100)">DEPARTURES PIER B</text>

                {/* Static edges */}
                {Object.entries(graph).map(([fromNode, edges]) => {
                  const fromObj = mapNodes.find(n => n.id === fromNode);
                  if (!fromObj) return null;
                  return edges.map(edge => {
                    const toObj = mapNodes.find(n => n.id === edge.to);
                    if (!toObj) return null;
                    return (
                      <line key={`${fromNode}-${edge.to}`} x1={fromObj.x} y1={fromObj.y} x2={toObj.x} y2={toObj.y}
                        stroke="rgba(0,212,255,0.08)" strokeWidth="1.5" strokeDasharray="3 3" />
                    );
                  });
                })}

                {/* Calculated route path */}
                {routeCalculated && path.length > 0 && (
                  <>
                    <path d={getSvgPathString()} fill="none" stroke="url(#pathGrad)" strokeWidth="8"
                      strokeLinecap="round" strokeLinejoin="round" opacity="0.3" filter="url(#glow)" />
                    <path d={getSvgPathString()} fill="none" stroke="url(#pathGrad)" strokeWidth="3"
                      strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10 10" className="animated-path" />
                  </>
                )}

                {/* Nodes */}
                {mapNodes.map((n) => {
                  const isStart = startPoint === n.id;
                  const isEnd = endPoint === n.id;
                  const isOnPath = path.includes(n.id);
                  const isHovered = hoveredNode === n.id;
                  const typeColor = nodeTypeColors[n.type];
                  let fillColor = typeColor;
                  let opacity = 0.7;
                  if (isStart) { fillColor = '#4ADE80'; opacity = 1; }
                  else if (isEnd) { fillColor = '#F43F5E'; opacity = 1; }
                  else if (isOnPath) { fillColor = '#00D4FF'; opacity = 1; }
                  if (isHovered) opacity = 1;

                  return (
                    <g key={n.id} style={{ cursor: 'pointer' }} onClick={() => handleNodeClick(n.id)}
                      onMouseEnter={() => setHoveredNode(n.id)} onMouseLeave={() => setHoveredNode(null)}>
                      {(isStart || isEnd || isHovered) && (
                        <circle cx={n.x} cy={n.y} r="8" fill="none" stroke={fillColor} strokeWidth="1.5" className="pulse-ring" />
                      )}
                      {/* Outer glow */}
                      <circle cx={n.x} cy={n.y} r={isHovered ? 14 : 10} fill={fillColor} opacity={0.1} filter="url(#softGlow)" />
                      {/* Main dot */}
                      <circle cx={n.x} cy={n.y} r={isHovered ? 8 : 6} fill={fillColor} stroke="#040B14" strokeWidth="2"
                        opacity={opacity} style={{ transition: 'all 0.2s ease' }} />
                      {/* Label */}
                      <text x={n.x} y={n.y - 14} fill={isHovered ? fillColor : 'rgba(240,244,255,0.65)'}
                        fontSize={isHovered ? '10' : '9'} fontWeight={isStart || isEnd || isHovered ? 'bold' : 'normal'}
                        textAnchor="middle" fontFamily="Outfit" style={{ transition: 'all 0.2s', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                        {n.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Legend */}
              <Box sx={{
                position: 'absolute', bottom: 16, right: 16, p: 1.5, borderRadius: '10px',
                background: 'rgba(4,11,20,0.9)', border: '1px solid rgba(0,212,255,0.12)', backdropFilter: 'blur(8px)',
              }}>
                <Typography sx={{ fontSize: '0.62rem', fontWeight: 800, color: '#4A6080', letterSpacing: 1, mb: 0.8 }}>LEGEND</Typography>
                {[
                  { label: 'Services', color: '#00D4FF' },
                  { label: 'Gates', color: '#F0C040' },
                  { label: 'Lounges', color: '#A78BFA' },
                  { label: 'Baggage', color: '#4ADE80' },
                ].map(item => (
                  <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.3 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: item.color }} />
                    <Typography sx={{ fontSize: '0.62rem', color: '#8BA3C7' }}>{item.label}</Typography>
                  </Box>
                ))}
              </Box>

              {/* Route label */}
              {routeCalculated && (
                <Box sx={{
                  position: 'absolute', bottom: 16, left: 16, px: 2, py: 1, borderRadius: '10px',
                  background: 'rgba(4,11,20,0.9)', border: '1px solid rgba(74,222,128,0.25)', backdropFilter: 'blur(8px)',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Route sx={{ color: '#4ADE80', fontSize: 14 }} />
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#4ADE80' }}>
                      {startPoint} → {endPoint}
                    </Typography>
                    <Chip size="small" label={`${walkingTime} min`} sx={{ height: 20, fontSize: '0.6rem', fontWeight: 700, bgcolor: 'rgba(74,222,128,0.1)', color: '#4ADE80', border: '1px solid rgba(74,222,128,0.2)' }} />
                  </Box>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NavigationPage;
