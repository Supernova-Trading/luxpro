// A question with its right answer and three wrong ones (v5 prize game).
export interface Mcq { q: string; a: string; w: string[] }
export interface Bank { easy: Mcq[]; medium: Mcq[]; hard: Mcq[]; riddles: Mcq[] }
