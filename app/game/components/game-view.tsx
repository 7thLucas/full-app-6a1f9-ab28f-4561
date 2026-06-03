import { useCallback } from "react";
import { GameHud } from "~/game/components/game-hud";
import { TableCard } from "~/game/components/table-card";
import { PrepStationPanel } from "~/game/components/prep-station";
import { PlayerHand } from "~/game/components/player-hand";
import { GameOverScreen } from "~/game/components/game-over-screen";
import { PauseOverlay } from "~/game/components/pause-overlay";
import { buildPrepStations } from "~/game/hooks/use-game-engine";
import type { GameState, MenuItem } from "~/game/types/game.types";

interface GameColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  success: string;
  warning: string;
  error: string;
}

interface GameViewProps {
  state: GameState;
  menuItems: MenuItem[];
  colors: GameColors;
  onPause: () => void;
  onResume: () => void;
  onHome: () => void;
  onRestart: () => void;
  onPrepare: (orderId: string, itemIndex: number) => void;
  onDeliverToTable: (tableId: number) => void;
  onPickUp: (orderId: string, itemId: string) => void;
  onDrop: () => void;
  onSelectTable: (tableId: number) => void;
}

export function GameView({
  state,
  menuItems,
  colors,
  onPause,
  onResume,
  onHome,
  onRestart,
  onPrepare,
  onDeliverToTable,
  onPickUp,
  onDrop,
  onSelectTable,
}: GameViewProps) {
  const prepStations = buildPrepStations(menuItems);
  const isGameOver = state.phase === "level_complete" || state.phase === "game_over";
  const isPaused = state.phase === "paused";

  const handleSelectOrDeliver = useCallback(
    (tableId: number) => {
      if (state.playerHandItem) {
        onDeliverToTable(tableId);
      } else {
        onSelectTable(tableId);
      }
    },
    [state.playerHandItem, onDeliverToTable, onSelectTable]
  );

  return (
    <div
      className="flex flex-col h-screen max-h-screen overflow-hidden relative"
      style={{ background: colors.background }}
    >
      {/* HUD */}
      <GameHud
        score={state.score}
        timeLeft={state.timeLeft}
        level={state.level}
        completedOrders={state.completedOrders}
        missedOrders={state.missedOrders}
        phase={state.phase}
        onPause={onPause}
        onResume={onResume}
        onHome={onHome}
        primaryColor={colors.primary}
        secondaryColor={colors.secondary}
        textPrimary={colors.textPrimary}
      />

      {/* Main gameplay area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — Tables grid */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="text-xs font-bold mb-2 px-1" style={{ color: colors.textSecondary }}>
            🪑 Cafe Floor — {state.tables.filter((t) => t.status !== "empty").length}/{state.tables.length} tables occupied
          </div>
          <div className="grid grid-cols-2 gap-3">
            {state.tables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                isSelected={state.selectedTableId === table.id}
                hasItemInHand={!!state.playerHandItem}
                onSelect={onSelectTable}
                onDeliver={onDeliverToTable}
                primaryColor={colors.primary}
                surfaceColor={colors.surface}
                textPrimary={colors.textPrimary}
                textSecondary={colors.textSecondary}
                successColor={colors.success}
                warningColor={colors.warning}
                errorColor={colors.error}
              />
            ))}
          </div>
        </div>

        {/* Right — Prep stations */}
        <div
          className="w-48 sm:w-56 overflow-y-auto p-3 flex flex-col gap-2 border-l"
          style={{
            borderColor: `${colors.primary}22`,
            background: `${colors.primary}08`,
          }}
        >
          <div className="text-xs font-bold mb-1 px-1" style={{ color: colors.textSecondary }}>
            🍳 Prep Stations
          </div>
          {prepStations.map((station) => (
            <PrepStationPanel
              key={station.id}
              station={station}
              activeOrders={state.activeOrders}
              prepQueue={state.prepQueue}
              playerHandItem={state.playerHandItem}
              onPrepare={onPrepare}
              onPickUp={onPickUp}
              primaryColor={colors.primary}
              secondaryColor={colors.secondary}
              accentColor={colors.accent}
              surfaceColor={colors.surface}
              textPrimary={colors.textPrimary}
              textSecondary={colors.textSecondary}
              successColor={colors.success}
              warningColor={colors.warning}
            />
          ))}
        </div>
      </div>

      {/* Bottom — Player hand (what they're carrying) */}
      <div
        className="px-3 pb-3 pt-2 border-t"
        style={{ borderColor: `${colors.primary}22`, background: `${colors.primary}08` }}
      >
        <div className="text-xs font-bold mb-1.5" style={{ color: colors.textSecondary }}>
          👐 In Your Hands
        </div>
        <PlayerHand
          item={state.playerHandItem}
          onDrop={onDrop}
          primaryColor={colors.primary}
          accentColor={colors.accent}
        />
      </div>

      {/* Game Over overlay */}
      {isGameOver && (
        <GameOverScreen
          score={state.score}
          completedOrders={state.completedOrders}
          missedOrders={state.missedOrders}
          level={state.level}
          isLevelComplete={state.phase === "level_complete"}
          onRestart={onRestart}
          onHome={onHome}
          primaryColor={colors.primary}
          secondaryColor={colors.secondary}
          successColor={colors.success}
          textPrimary={colors.textPrimary}
          textSecondary={colors.textSecondary}
          surfaceColor={colors.surface}
        />
      )}

      {/* Pause overlay */}
      {isPaused && (
        <PauseOverlay
          onResume={onResume}
          onHome={onHome}
          primaryColor={colors.primary}
          surfaceColor={colors.surface}
          textPrimary={colors.textPrimary}
          textSecondary={colors.textSecondary}
        />
      )}
    </div>
  );
}
