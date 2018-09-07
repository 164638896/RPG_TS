declare class Playercfg {
	id: number
	res: string
	hp: number
	atk: number
	def: number
	speed: number
	skill: any[]
}
declare class Skillcfg {
	id: number
	name: string
	ani: string
	self_effect: string
	target_effect: string
	dis: number
	behavior_buff: string
	move_buff: string
	hurt_buff: string
	constrol_buff: string
}
declare class Scenecfg {
	id: number
	res: string
}
declare class Monstercfg {
	id: number
	res: string
	hp: number
	atk: number
	def: number
	speed: number
	skill: any[]
}
declare class Npccfg {
	id: number
	res: string
	hp: number
	atk: number
	def: number
	speed: number
	skill: any[]
}
