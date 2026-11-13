import type { Project } from "../types";
import { aeropulse } from "./aeropulse";
import { askTheMesh } from "./ask-the-mesh";
import { charlie } from "./charlie";
import { cordon } from "./cordon";
import { dockline } from "./dockline";
import { gpuLab } from "./gpu-lab";
import { helio } from "./helio";
import { ledgerline } from "./ledgerline";
import { ramp } from "./ramp";
import { tidewater } from "./tidewater";

/** Every project with a full case study, in default (role-agnostic) order. */
export const projects: Project[] = [helio, gpuLab, dockline, aeropulse, cordon, charlie, ramp, askTheMesh, ledgerline, tidewater];

/** Default homepage selection — eight flagships. */
export const DEFAULT_FEATURED = ["helio", "gpu-lab", "dockline", "aeropulse", "cordon", "charlie", "ramp", "ask-the-mesh"];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
