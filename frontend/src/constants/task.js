// Sumber tunggal (single source of truth) untuk nilai domain task yang dipakai lintas komponen & hook.

export const TASK_STATUS = Object.freeze({
  TODO: 'Todo',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
})

// Urutan status sesuai alur kerja; dipakai untuk kolom Kanban dan opsi <select>.
export const TASK_STATUSES = [TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE]

export const DEFAULT_TASK_STATUS = TASK_STATUS.TODO

// Filter khusus untuk menampilkan seluruh status dalam tampilan Board.
export const FILTER_ALL = 'All'
export const TASK_FILTERS = [FILTER_ALL, ...TASK_STATUSES]

// Batas validasi form, diselaraskan dengan validasi backend.
export const TITLE_MAX_LENGTH = 120
export const DESCRIPTION_MAX_LENGTH = 2000

// Jumlah kartu yang tampil per kolom Kanban sebelum tombol "Show more".
export const KANBAN_INITIAL_LIMIT = 3

// Metadata tampilan per status (judul kolom & teks empty state).
export const STATUS_META = {
  [TASK_STATUS.TODO]: { title: 'Todo', emptyText: 'No tasks to do' },
  [TASK_STATUS.IN_PROGRESS]: { title: 'In Progress', emptyText: 'Nothing in progress' },
  [TASK_STATUS.DONE]: { title: 'Done', emptyText: 'No completed tasks' },
}
