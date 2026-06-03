/**
 * Level Difficulty Configuration
 *
 * Single source of truth for all per-level difficulty tuning in Cafe Dash.
 * Each level entry controls how patient customers are, how often new ones
 * arrive, and how many can be waiting simultaneously.
 *
 * Escalation curve:
 *   - Patience decreases     (45s → ~20s)
 *   - Arrivals get faster    (8s   → ~3s)
 *   - Customer cap rises     (3    → 6)
 */
export interface LevelConfig {
  /** Seconds a customer will wait before leaving angrily. */
  patienceTimerSeconds: number;
  /** Seconds between consecutive customer spawns. */
  arrivalIntervalSeconds: number;
  /** Maximum customers that can be seated at the same time. */
  maxSimultaneousCustomers: number;
}

export const levelConfigs: LevelConfig[] = [
  // Level 1 — gentle intro
  { patienceTimerSeconds: 45, arrivalIntervalSeconds: 8.0, maxSimultaneousCustomers: 3 },
  // Level 2
  { patienceTimerSeconds: 42, arrivalIntervalSeconds: 7.5, maxSimultaneousCustomers: 3 },
  // Level 3
  { patienceTimerSeconds: 39, arrivalIntervalSeconds: 7.0, maxSimultaneousCustomers: 4 },
  // Level 4
  { patienceTimerSeconds: 36, arrivalIntervalSeconds: 6.5, maxSimultaneousCustomers: 4 },
  // Level 5
  { patienceTimerSeconds: 33, arrivalIntervalSeconds: 6.0, maxSimultaneousCustomers: 4 },
  // Level 6
  { patienceTimerSeconds: 30, arrivalIntervalSeconds: 5.5, maxSimultaneousCustomers: 5 },
  // Level 7
  { patienceTimerSeconds: 28, arrivalIntervalSeconds: 5.0, maxSimultaneousCustomers: 5 },
  // Level 8
  { patienceTimerSeconds: 25, arrivalIntervalSeconds: 4.5, maxSimultaneousCustomers: 5 },
  // Level 9
  { patienceTimerSeconds: 22, arrivalIntervalSeconds: 4.0, maxSimultaneousCustomers: 6 },
  // Level 10 — the rush
  { patienceTimerSeconds: 20, arrivalIntervalSeconds: 3.0, maxSimultaneousCustomers: 6 },
];

/**
 * Resolve the LevelConfig for a 1-based level index. Levels beyond the
 * defined range clamp to the hardest (last) entry so the game keeps
 * playing rather than crashing if someone overshoots.
 */
export function getLevelConfig(levelIndex: number): LevelConfig {
  if (!Number.isFinite(levelIndex) || levelIndex < 1) {
    return levelConfigs[0];
  }
  const clampedIndex = Math.min(levelIndex, levelConfigs.length) - 1;
  return levelConfigs[clampedIndex];
}
