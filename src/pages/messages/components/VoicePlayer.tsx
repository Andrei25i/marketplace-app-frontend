import {
  ActionIcon,
  Box,
  Group,
  Slider,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import classes from "@/pages/messages/Messages.module.css";
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from "@tabler/icons-react";
import { formatDuration } from "@/utils/chat.util";

const SPEEDS = [1, 1.5, 2];

let currentAudio: HTMLAudioElement | null = null;

type VoicePlayerProps = {
  url: string;
  durationMs: number | null;
  own: boolean;
};

const VoicePlayer = ({ url, durationMs, own }: VoicePlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [currentMs, setCurrentMs] = useState(0);
  const [dragMs, setDragMs] = useState<number | null>(null);
  const [metaMs, setMetaMs] = useState<number | null>(null);
  const [speed, setSpeed] = useState(1);

  const totalMs = durationMs ?? metaMs ?? 0;
  const shownMs = dragMs ?? currentMs;
  const totalSec = Math.round(totalMs / 1000);
  const started = playing || shownMs > 0;
  const shownSec = started
    ? Math.max(0, totalSec - Math.floor(shownMs / 1000))
    : totalSec;
  const timeLabel = formatDuration(shownSec * 1000);

  useEffect(() => {
    if (!playing) return;

    let frame = 0;
    const tick = () => {
      const audio = audioRef.current;
      if (audio) setCurrentMs(audio.currentTime * 1000);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [playing]);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio && currentAudio === audio) {
        audio.pause();
        currentAudio = null;
      }
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    if (currentAudio && currentAudio !== audio) currentAudio.pause();
    currentAudio = audio;
    audio.playbackRate = speed;

    try {
      await audio.play();
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setFailed(true);
      }
    }
  };

  const cycleSpeed = () => {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  const seek = (ms: number) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = ms / 1000;
    setCurrentMs(ms);
    setDragMs(null);
  };

  return (
    <Group gap={8} wrap="nowrap" className={classes.voice}>
      <ActionIcon
        size={34}
        radius="xl"
        variant={own ? "white" : "filled"}
        color="primary"
        onClick={() => void toggle()}
        loading={loading}
        disabled={failed}
        aria-label={playing ? "Pauză" : "Redă mesajul vocal"}
      >
        {playing ? (
          <IconPlayerPauseFilled size={16} />
        ) : (
          <IconPlayerPlayFilled size={16} />
        )}
      </ActionIcon>

      <Box style={{ flex: 1, minWidth: 0 }}>
        <Slider
          size="xs"
          thumbSize={10}
          min={0}
          max={totalMs || 1}
          step={100}
          value={Math.min(shownMs, totalMs || 1)}
          onChange={setDragMs}
          onChangeEnd={seek}
          label={null}
          disabled={failed || totalMs === 0}
          color={own ? "white" : "primary"}
          classNames={{ root: classes.voiceSlider, thumb: classes.voiceThumb }}
          data-own={own || undefined}
          aria-label="Derulează mesajul vocal"
        />

        <Group justify="space-between" wrap="nowrap" mt={6}>
          <Text
            component="span"
            className={classes.meta}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {failed ? "Nu se poate reda" : timeLabel}
          </Text>

          <UnstyledButton
            className={classes.voiceSpeed}
            onClick={cycleSpeed}
            aria-label="Viteza de redare"
          >
            {speed}x
          </UnstyledButton>
        </Group>
      </Box>

      <audio
        ref={audioRef}
        src={url}
        preload="metadata"
        onLoadedMetadata={(event) => {
          const seconds = event.currentTarget.duration;
          if (Number.isFinite(seconds)) setMetaMs(seconds * 1000);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => {
          setPlaying(false);
          setLoading(false);
        }}
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
        onEnded={(event) => {
          event.currentTarget.currentTime = 0;
          setCurrentMs(0);
          setPlaying(false);
          if (currentAudio === event.currentTarget) currentAudio = null;
        }}
        onError={() => {
          setFailed(true);
          setLoading(false);
        }}
      />
    </Group>
  );
};

export default VoicePlayer;
