export type Experiment = {
  key: string
  experimentId: string
  title: string
  description: string
  technologies: string[]
  githubUrl: string
  image: Blob | null
  video: Blob | null
  createdAt: number
  updatedAt: number
}

export type ExperimentInput = Omit<Experiment, 'key' | 'createdAt' | 'updatedAt'>

export type Profile = {
  photo: Blob | null
  githubUrl: string
}
