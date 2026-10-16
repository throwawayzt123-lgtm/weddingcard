import type { Photo } from "./config";

// The shared picture library for the full-screen chapters. Every design picks the pictures that suit it
// (see each design's chapters.tsx). All are free stock photographs from Pexels (see docs/ASSETS.md for the list).
// To use your own pictures: replace a file in /public/templates/photos with one of the same name.

const P = (file: string, alt: string, position?: string): Photo => ({ src: `/templates/photos/${file}.webp`, alt, position });

/** The picture of the first chapter (Blessings) in every design: hands with henna, no couple. */
export const COVER_PHOTO: Photo = P("hands-wedding", "A groom and bride holding hands, decorated with henna and red bangles");

export const POOL = {
  "door-jaipur": P("door-jaipur", "A carved golden palace door framed by painted peacock arches", "50% 45%"),
  "corridor-amber": P("corridor-amber", "A sunlit marble corridor with carved arches in a palace"),
  "hall-palace": P("hall-palace", "A grand wedding hall with a red carpet, lamps and flower arrangements"),
  "silk-gold": P("silk-gold", "Folds of golden silk"),
  "rose-red-teal": P("rose-red-teal", "A deep red rose with dew drops on a dark teal background"),
  "rose-dark": P("rose-dark", "A red rose in soft dark light"),
  "rose-black": P("rose-black", "A single red rose on black"),
  "rose-white-dark": P("rose-white-dark", "A cream rose in the shadows", "70% 50%"),
  candlesticks: P("candlesticks", "Golden candlesticks on a long wedding table"),
  "table-candle": P("table-candle", "A candle and glasses on a white wedding table"),
  "centerpiece-white": P("centerpiece-white", "A white flower centrepiece with candles"),
  "table-banquet": P("table-banquet", "A colourful reception table with flowers and candles"),
  "table-greenery": P("table-greenery", "A wedding table with greenery, white flowers and candles"),
  "candles-night": P("candles-night", "Candles glowing among glasses at night"),
  "lights-bokeh": P("lights-bokeh", "Warm fairy lights glowing in cupped hands"),
  "mehndi-decor": P("mehndi-decor", "A mehndi night with golden tinsel curtains and henna-painted hands", "50% 40%"),
  "mehndi-hands": P("mehndi-hands", "Hands decorated with intricate henna", "50% 50%"),
  "jasmine-leaves": P("jasmine-leaves", "A white jasmine flower among dark green leaves"),
  "flowers-night": P("flowers-night", "Small white flowers on a dark background"),
  blossoms: P("blossoms", "A mass of tiny white blossoms"),
  "garden-aisle": P("garden-aisle", "A garden wedding aisle lined with white flowers"),
  "garden-arch": P("garden-arch", "A flowered arch at the end of a garden aisle"),
  "garden-chairs": P("garden-chairs", "Wooden chairs under trees for a garden ceremony"),
  "venue-white": P("venue-white", "White chairs under a glasshouse ceiling leading to a floral arch"),
  "drapes-white": P("drapes-white", "White drapes and greenery over a ceremony table"),
  "mosaic-brown": P("mosaic-brown", "A carved brown and gold Persian mosaic ceiling"),
  "dome-mosque": P("dome-mosque", "The patterned ceiling of a mosque dome"),
  "tiles-blue": P("tiles-blue", "Blue geometric tile-work in a mosque entrance"),
  "tiles-blue-night": P("tiles-blue-night", "Glowing cobalt Islamic tile-work"),
  moon: P("moon", "A crescent moon in a starry night sky", "50% 40%"),
  "silk-black": P("silk-black", "Folds of black satin"),
  "silk-champagne": P("silk-champagne", "Folds of champagne silk"),
  "silk-gold-fold": P("silk-gold-fold", "Soft gold fabric"),
  "pavilion-marble": P("pavilion-marble", "A marble pavilion with scalloped arches"),
  "fort-ruin": P("fort-ruin", "A weathered sandstone fort with arched windows"),
  "dome-agra": P("dome-agra", "A sandstone palace with domes and carved balconies"),
  "peacock-plumes": P("peacock-plumes", "Peacock feathers with iridescent eyes"),
  "peacock-eye": P("peacock-eye", "A peacock feather eye in green and blue"),
  "peacock-blue": P("peacock-blue", "A close view of a deep blue peacock feather"),
  "peacock-feather": P("peacock-feather", "Delicate peacock feathers in teal and violet"),
  "feather-teal": P("feather-teal", "Teal and midnight feathers"),
};

export type PhotoName = keyof typeof POOL;

/** A list of pictures from the library, in the order a design wants to use them. */
export const pictures = (...names: PhotoName[]): Photo[] => names.map((n) => POOL[n]);
