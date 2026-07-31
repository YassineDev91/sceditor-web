import Konva from 'konva';

// A single reusable off-stage Text node, re-attributed per call, instead of
// allocating a new one every time this runs inside a per-frame Konva
// computed config.
let measurer = null;

export function measureTextWidth(text, fontSize = 12, fontFamily = 'Arial') {
  if (!measurer) {
    measurer = new Konva.Text({ text: '', fontSize, fontFamily });
  }
  measurer.setAttrs({ text: text || '', fontSize, fontFamily });
  return measurer.getTextWidth();
}
