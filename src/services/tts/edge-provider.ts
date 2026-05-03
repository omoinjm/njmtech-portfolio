import { ITtsProvider } from "./types";
import { EdgeTTS } from "edge-tts-universal";

type ArrayBufferLikeSource = {
  arrayBuffer(): Promise<ArrayBuffer>;
};

const hasArrayBuffer = (value: unknown): value is ArrayBufferLikeSource => {
  if (typeof value !== "object" || value === null || !("arrayBuffer" in value)) {
    return false;
  }

  return typeof value.arrayBuffer === "function";
};

const getAudioDataDescription = (value: unknown): string => Object.prototype.toString.call(value);

export class EdgeTtsProvider implements ITtsProvider {
  public readonly name = "EdgeTTS";

  constructor(private readonly voice: string = "en-US-ChristopherNeural") {}

  async synthesize(text: string): Promise<ArrayBuffer> {
    const tts = new EdgeTTS(text, this.voice);
    const result = await tts.synthesize();
    
    if (!result || !result.audio) {
      throw new Error("EdgeTTS returned no audio data");
    }

    const buf: unknown = result.audio;

    if (hasArrayBuffer(buf)) {
      return await buf.arrayBuffer();
    }

    if (buf instanceof Uint8Array) {
      return Uint8Array.from(buf).buffer;
    }

    if (buf instanceof ArrayBuffer) {
      return buf;
    }

    throw new Error(`Unsupported audio data format from EdgeTTS: ${getAudioDataDescription(buf)}`);
  }
}
