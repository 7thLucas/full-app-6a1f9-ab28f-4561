import { useCallback, useState } from "react";
import { useConfigurables } from "~/modules/configurables";
import { HomeScreen } from "~/game/components/home-screen";
import { GameView } from "~/game/components/game-view";
import { useGameEngine } from "~/game/hooks/use-game-engine";
import type { MenuItem } from "~/game/types/game.types";
import { defaultConfigurablesData } from "~/modules/configurables/src/constants/configurables.default";

const DEFAULT_MENU_ITEMS: MenuItem[] = defaultConfigurablesData.menuItems ?? [];

export function CafeDash() {
  const { config, loading } = useConfigurables();

  const appName = config?.appName ?? "Cafe Dash";
  const tagline = config?.tagline ?? "Rush. Serve. Repeat.";
  const logoUrl = config?.logoUrl ?? "";
  const heroImageUrl = config?.heroImageUrl ?? "";
  const welcomeTitle = config?.welcomeTitle ?? "Welcome to Cafe Dash!";
  const welcomeSubtitle =
    config?.welcomeSubtitle ??
    "Take orders, prep food, and deliver before time runs out. Can you handle the rush?";
  const playButtonLabel = config?.playButtonLabel ?? "Start Playing";

  const primaryColor = config?.brandColor?.primary ?? "#FF7043";
  const secondaryColor = config?.brandColor?.secondary ?? "#FFC107";
  const accentColor = config?.brandColor?.accent ?? "#26C6DA";
  const backgroundColor = config?.gameColors?.background ?? "#FFF8F0";
  const surfaceColor = config?.gameColors?.surface ?? "#FFE0CC";
  const textPrimary = config?.gameColors?.textPrimary ?? "#3E2723";
  const textSecondary = config?.gameColors?.textSecondary ?? "#6D4C41";
  const successColor = config?.gameColors?.success ?? "#66BB6A";
  const warningColor = config?.gameColors?.warning ?? "#FFA726";
  const errorColor = config?.gameColors?.error ?? "#EF5350";

  const levelDurationSeconds = config?.gameSettings?.levelDurationSeconds ?? 90;
  const maxCustomers = config?.gameSettings?.maxCustomers ?? 12;
  const numTables = config?.gameSettings?.numTables ?? 4;
  const pointsPerDelivery = config?.gameSettings?.pointsPerDelivery ?? 100;

  const menuItems: MenuItem[] =
    config?.menuItems && config.menuItems.length > 0
      ? config.menuItems
      : DEFAULT_MENU_ITEMS;

  const engine = useGameEngine({
    numTables,
    levelDurationSeconds,
    maxCustomers,
    pointsPerDelivery,
    menuItems,
  });

  const { state } = engine;

  const handlePlay = useCallback(() => {
    engine.startGame(1);
  }, [engine]);

  const handleRestart = useCallback(() => {
    engine.startGame(state.level);
  }, [engine, state.level]);

  const handleSelectTable = useCallback(
    (tableId: number) => {
      // No-op selection — table card handles its own visual selection
      // We could track this in state, but for now deliver handles it directly
    },
    []
  );

  const colors = {
    primary: primaryColor,
    secondary: secondaryColor,
    accent: accentColor,
    background: backgroundColor,
    surface: surfaceColor,
    textPrimary,
    textSecondary,
    success: successColor,
    warning: warningColor,
    error: errorColor,
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: backgroundColor }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: `${primaryColor}44`, borderTopColor: primaryColor }}
          />
          <p className="text-sm font-semibold" style={{ color: textSecondary }}>
            Loading café...
          </p>
        </div>
      </div>
    );
  }

  if (state.phase === "home") {
    return (
      <HomeScreen
        appName={appName}
        tagline={tagline}
        welcomeTitle={welcomeTitle}
        welcomeSubtitle={welcomeSubtitle}
        playButtonLabel={playButtonLabel}
        logoUrl={logoUrl}
        heroImageUrl={heroImageUrl}
        onPlay={handlePlay}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        accentColor={accentColor}
        backgroundColor={backgroundColor}
        surfaceColor={surfaceColor}
        textPrimary={textPrimary}
        textSecondary={textSecondary}
      />
    );
  }

  return (
    <GameView
      state={state}
      menuItems={menuItems}
      colors={colors}
      onPause={engine.pauseGame}
      onResume={engine.resumeGame}
      onHome={engine.goHome}
      onRestart={handleRestart}
      onPrepare={engine.prepareItem}
      onDeliverToTable={engine.deliverToTable}
      onPickUp={engine.pickUpItem}
      onDrop={engine.dropItem}
      onSelectTable={handleSelectTable}
    />
  );
}
