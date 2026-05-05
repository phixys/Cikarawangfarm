const steps = [
  {
    number: '1',
    title: 'Pilih Paket',
    description: 'Pilih paket aqiqah atau ternak sesuai kebutuhan Anda',
  },
  {
    number: '2',
    title: 'Isi Form',
    description: 'Isi data pemesan dan detail pesanan dengan lengkap',
  },
  {
    number: '3',
    title: 'Bayar DP',
    description: 'Transfer DP dan upload bukti pembayaran',
  },
  {
    number: '4',
    title: 'Terima Pesanan',
    description: 'Pantau status dan terima pesanan di rumah Anda',
  },
];

export default function CaraPemesananSection() {
  return (
    <section className="bg-white py-14 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-[1.6rem] font-bold text-gray-900">
            Cara{' '}
            <span className="text-primary-medium">Pemesanan</span>
          </h2>
          <p className="text-gray-500 text-[13.5px] mt-1">
            Mudah, cepat, dan terpercaya dalam 4 langkah
          </p>
        </div>

        {/* Steps */}
        <div className="flex items-start justify-between gap-0">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-start flex-1">
              {/* Step card */}
              <div className="flex flex-col items-center text-center flex-1 px-2">
                {/* Circle */}
                <div className="w-[52px] h-[52px] rounded-full bg-primary-dark text-white text-[20px] font-bold flex items-center justify-center shadow-md mb-4">
                  {step.number}
                </div>
                <p className="text-gray-900 font-semibold text-[14px] mb-1.5">
                  {step.title}
                </p>
                <p className="text-gray-500 text-[12.5px] leading-relaxed max-w-[140px]">
                  {step.description}
                </p>
              </div>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="flex items-center pb-8 text-primary-light text-[22px] mt-3 shrink-0">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
