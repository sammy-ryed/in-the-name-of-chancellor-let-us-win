import raw from "./programmes.json";
import type { FinderData } from "./types";

/**
 * Snapshot of https://www.srmist.edu.in/program-finder/ — programme titles, links and
 * the real membership of every level, delivery, type, college and department filter.
 * Campus → college and college → department cascades come from the same site.
 */
export const finderData = raw as FinderData;
