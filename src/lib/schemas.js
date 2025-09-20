// lib/schemas.js
import { z } from "zod";

const siteEnum = z.enum(["ILLEGAL_CONNECTION", "ILLEGAL_REFINERY", "OTHER"]);

const IllegalSiteSchema = z.object({
  category: siteEnum,
  location: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
});

const BurntAssetSchema = z.object({
  name: z.string().min(1),
  notes: z.string().optional().nullable(),
});

const LeakageSiteSchema = z.object({
  category: z.string().min(1), // e.g. "Oil Leakage" or "Gas Leakage"
  location: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
});

export const UpsertIncidentSchema = z.object({
  year: z.number().int().min(1900).max(3000),
  month: z.number().int().min(1).max(12),

  // ✅ metrics optional now
  illegalConnections: z.number().int().min(0).optional(),
  illegalRefineries: z.number().int().min(0).optional(),
  oilLeaks: z.number().int().min(0).optional(),
  gasLeaks: z.number().int().min(0).optional(),
  arrestsMade: z.number().int().min(0).optional(),
  aversions: z.number().int().min(0).optional(),

  litersAGO: z.number().min(0).optional(),
  litersPMS: z.number().min(0).optional(),
  litersCrude: z.number().min(0).optional(),

  illegalSites: z.array(IllegalSiteSchema).optional(),
  burntAssets: z.array(BurntAssetSchema).optional(),
  leakageSites: z.array(LeakageSiteSchema).optional(),
});
