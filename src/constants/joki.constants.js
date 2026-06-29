export const ORDER_CATEGORIES = ['JOKI RANK', 'JOKI GENDONG', 'JOKI RISING', 'JOKI MONTAGE']
export const ORDER_TYPES      = ['NEW', 'RO']
export const PAYMENT_METHODS  = ['QRIS', 'BCA', 'DANA', 'SPAY', 'SEABANK', 'OVO', 'GOPAY']
export const ORDER_STATUS     = ['PENDING', 'DONE', 'PROCESS']
export const COLUMN_TYPES     = ['text', 'number', 'select', 'date', 'boolean']

export const DEFAULT_COLUMNS = [
  { key: 'name',         label: 'Nama Customer', type: 'text',   required: true  },
  { key: 'date',         label: 'Tanggal',       type: 'date',   required: true  },
  { key: 'category',     label: 'Kategori',      type: 'select', required: true  },
  { key: 'type',         label: 'Tipe',          type: 'select', required: true  },
  { key: 'payment',      label: 'Pembayaran',    type: 'select', required: true  },
  { key: 'price',        label: 'Harga',         type: 'number', required: true  },
  { key: 'workerSalary', label: 'Gaji Worker',   type: 'number', required: false },
  { key: 'profit',       label: 'Profit',        type: 'number', required: false },
]