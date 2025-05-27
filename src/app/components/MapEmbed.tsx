type Props = {
  input: string;
};

export default function MapEmbed({ input }: Props) {
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(input)}&output=embed`;

  return (
    <iframe
      src={embedUrl}
      className="w-full h-64 rounded-md border"
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
