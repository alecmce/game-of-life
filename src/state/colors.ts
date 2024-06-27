import chroma from "chroma-js";
import { Getter, atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { rnd } from "../lib/random";

enum COLOR_SCHEME {
  RAINBOW = 'RAINBOW',
  SUMMER = 'SUMMER',
  NEUTRAL = 'NEUTRAL',
  SPRING = 'SPRING',
  HAPPY = 'HAPPY',
  WINTER = 'WINTER',
  AUTUMN = 'AUTUMN',
}

type RGB = [r: number, g: number, b: number]

export interface GetRandomColor {
  (): RGB
}

export const COLOR_SCHEME_OPTIONS = Object.values(COLOR_SCHEME).map(value => ({ label: value.toLocaleUpperCase(), value }))

const SCHEMES: Record<COLOR_SCHEME, RGB[]> = {
  [COLOR_SCHEME.RAINBOW]: process('#ff0000','#ff8800','#FFEE00','#00FF00', '#1E90FF', '#0000CD', '#9900FF'),
  [COLOR_SCHEME.SUMMER]: process('#FD4F84', '#D9D3C1', '#F2AE30', '#F29D35', '#FA6620'),
  [COLOR_SCHEME.NEUTRAL]: process('#D0C2B0', '#DBCDA4', '#6B4945', '#E89275', '#9CBCB7'),
  [COLOR_SCHEME.SPRING]: process('#39E7E8', '#ADFF5B', '#628DFF', '#68E849', '#FFFC8D'),
  [COLOR_SCHEME.HAPPY]: process('#FFD700', '#FFA500', '#FF6347', '#FF69B4', '#FF1493'),
  [COLOR_SCHEME.WINTER]: process('#0F1926', '#192E40', '#5D84A6', '#6FA0BF', '#F2F0F0'),
  [COLOR_SCHEME.AUTUMN]: process('#F2C335', '#F28F16', '#D95204', '#592202', '#A62103'),
}

function process(...colors: string[]): RGB[] {
  return colors.map(toRgb)

  function toRgb(color: string): RGB {
    const [r, g, b] = chroma(color).gl()
    return [r, g, b]
  }
}

/** An read/write atom that stores a named color scheme. */
export const colorScheme = atomWithStorage('gol:colors', COLOR_SCHEME.SUMMER)

/** A readonly atom that returns the RGB[] colors of a given named color scheme. */
const colors = atom(getColors)

function getColors(get: Getter): RGB[] {
  return SCHEMES[get(colorScheme)]
}

/** A readonly atom that returns a random-color generator based on the color scheme. */
export const randomColor = atom(getRandomColorGenerator)

function getRandomColorGenerator(get: Getter): GetRandomColor {
  const scale = get(colors)

  return function getRandomColor(): RGB {
    return scale[Math.floor(rnd(0, scale.length))]
  }
}
