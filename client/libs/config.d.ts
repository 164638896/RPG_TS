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
	asynres: any[]
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
declare class Behaviorbuffcfg {
	id: number
	name: string
	duration: number
	CanMove: number
	CanAtk: number
}
declare class Movebuffcfg {
	id: number
	name: string
	duration: number
	Dir: number
	Distance: number
}
declare class Hurtbuffcfg {
	id: number
	name: string
	duration: number
	ani: string
}
declare class Controlbuffcfg {
	id: number
	name: string
	duration: number
	ClearBuff: number
	EnableBehavior: number
	EnableMove: number
	EnableHurt: number
	EnableSelect: number
}
