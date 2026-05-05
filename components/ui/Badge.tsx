type BadgeVariant = 'vaksin' | 'tersedia' | 'terpopuler' | 'baru' | 'jantan' | 'betina';

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  vaksin:     'bg-blue-50 text-blue-700 border border-blue-200',
  tersedia:   'bg-green-100 text-green-800',
  terpopuler: 'bg-yellow-100 text-yellow-800',
  baru:       'bg-blue-100 text-blue-800',
  jantan:     'bg-transparent text-blue-700 border border-blue-400',
  betina:     'bg-transparent text-pink-700 border border-pink-400',
};

const defaultLabels: Record<BadgeVariant, string> = {
  vaksin:     'Vaksin',
  tersedia:   'Tersedia',
  terpopuler: 'Terpopuler',
  baru:       'Baru',
  jantan:     'Jantan',
  betina:     'Betina',
};

export default function Badge({ variant, label }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium
        ${variantStyles[variant]}
      `}
    >
      {label ?? defaultLabels[variant]}
    </span>
  );
}
