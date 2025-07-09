interface PartnerFilters {
	langLevel: LangLevel[],
	minAge: number,
	maxAge: number,
	gender: string
}

export interface Role {
	type: "student" | "teacher" | "parent" | "admin" | "user"
}

export interface User {
	_id: string
	name: string
	surname: string
	email: string
	password: string
	roles: Role[]
	matches: any[]
	// from page /about-me-form:
	partnerFilters?: PartnerFilters
	gender?: string
	langLevel?: LangLevel
	age?: number
	idealPartnerDescription?: string
}
