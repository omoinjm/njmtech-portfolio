import { ITtsProvider } from "./types";
import { Client } from "@gradio/client";

export class VoxCpmProvider implements ITtsProvider {
  public readonly name = "VoxCPM";

  constructor(
    private readonly refAudio: string | null,
    private readonly voiceInstruction: string,
    private readonly hfToken?: string
  ) {}

  async synthesize(text: string): Promise<ArrayBuffer> {
    const client = await Client.connect("openbmb/VoxCPM-Demo", {
      hf_token: this.hfToken as `hf_${string}` || undefined,
    });

    const result = await client.predict("/generate", { 
      text_input: text,
      control_instruction: this.voiceInstruction,
      reference_wav_path_input: this.refAudio ? { 
        path: this.refAudio,
        meta: { _type: "gradio.FileData" }
      } : null,
      use_prompt_text: false,
      prompt_text_input: "",
      cfg_value_input: 1.5,
      do_normalize: true,
      denoise: true,
    });

    if (result && result.data && result.data[0]) {
      const audioData = result.data[0];
      const audioUrl = typeof audioData === 'string' ? audioData : audioData.url;

      if (audioUrl) {
        const audioResponse = await fetch(audioUrl);
        if (audioResponse.ok) {
          return await audioResponse.arrayBuffer();
        }
      }
    }

    throw new Error("VoxCPM failed to generate valid audio buffer");
  }
}
