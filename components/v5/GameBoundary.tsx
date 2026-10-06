"use client";

import { Component, type ReactNode } from "react";

// If one game crashes (or its code can't load with no signal), only that game
// closes; music, tips and requests carry on (council 2026-10-06; impeccable
// reference/harden.md: never block the entire interface when one component
// errors). Keyed by game in App, so the next game starts fresh.
export default class GameBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("LuxPro game error", error);
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
