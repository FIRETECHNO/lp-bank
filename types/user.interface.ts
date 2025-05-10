interface PartnerFilters {
	langLevel: LangLevel[],
	minAge: number,
	maxAge: number,
	gender: string
}

export interface User {
	_id: string
	name: string
	surname: string
	email: string
	password: string
	roles: string[]
	matches: any[]
	// from page /about-me-form:
	partnerFilters?: PartnerFilters
	gender?: string
	langLevel?: LangLevel
	age?: number
	idealPartnerDescription?: string
}
