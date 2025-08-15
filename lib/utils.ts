import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { projectPhaseColors } from "./constants";
import { $Enums } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getPhaseColor = (phase: $Enums.ProjectPhase) => {
  return projectPhaseColors[phase] || "bg-gray-400";
};

