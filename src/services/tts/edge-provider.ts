import { ITtsProvider } from "./types";
import { EdgeTTS } from "edge-tts-universal";

export class EdgeTtsProvider implements ITtsProvider {
  public readonly name = "EdgeTTS";

  constructor(private readonly voice: string = "en-US-ChristopherNeural") {}

  async synthesize(text: string): Promise<ArrayBuffer> {
    const tts = new EdgeTTS(text, this.voice);
    const result = await tts.synthesize();
    
    if (!result || !result.audio) {
      throw new Error("EdgeTTS returned no audio data");
    }

    const buf = result.audio;

    // Handle Web API 'Blob' (found in your logs)
    if (typeof (buf as any).arrayBuffer === 'function') {
      return await (buf as any).arrayBuffer();
    }

    // Handle Node.js Buffer / Uint8Array
    if (buf instanceof Uint8Array || (typeof Buffer !== 'undefined' && Buffer.isBuffer(buf))) {
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }

    // If it's already an ArrayBuffer
    if (buf instanceof ArrayBuffer) return buf;

    throw new Error(`Unsupported audio data format from EdgeTTS: ${buf?.constructor?.name || typeof buf}`);
  }
}
