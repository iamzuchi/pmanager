// lib/constants.ts

import { $Enums } from "@prisma/client";

export const projectPhaseColors: Record<$Enums.ProjectPhase, string> = {
  OPEN: "bg-green-500",
  ON_HOLD: "bg-orange-500",
  INVOICING: "bg-purple-500",
  CLOSED: "bg-red-500",
  ARCHIVED: "bg-gray-500",
};

export const phaseLabels: Record<string, string> = {
  OPEN: "O",
  ON_HOLD: "H",
  INVOICING: "I",
  CLOSED: "C",
  ARCHIVED: "A",
};
  