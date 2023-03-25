import { Response } from 'express';
import { RequestWithUser } from '../../types/request-with-user';
import { prisma } from '../../prisma';
import { RoomState } from '@prisma/client';

export const createRoom = async (req: RequestWithUser, res: Response) => {
  const { name } = req.body;
  const userId = req.user?.id;
  // Valida se o nome da sala e nulo
  if(!name){
    return res.status(400).json({
      success : false,
      message : 'Erro ao criar sala ' + name})
  }
  // Valida se  o nome da sala e superior que 20 caracteres
  if(name.length > 20){
    return res.status(400).json({
      success : false,
      message : 'O nome da sala não pode ter mais de {} caracteres.' + name.length()})
  }
  // Valida se userId e Undefined
  // Valida se o nome da sala ja existe ou se o usuário ja tenha criado outra sala
  if(userId !== undefined && await roomExists(name, userId)){
    return res.status(400).json({
      success : false,
      message : 'O nome da sala ja existe ! ' + name})
  }
  // Create room
  try{
    const room = await prisma.room.create({
      data: {
        name:name,
        state : RoomState.WAITING_FOR_PLAYERS,
        creator: {
          connect : { 
            id : userId
          },
        }
      },
      select: {
        id: true,
        name: true,
        flow: true,
        state: true,
        createdAt: true,
        updatedAt: true
      }
    });
  
    return res.status(201).json(room);
  }catch(error){
    return res.status(400).json({
      success : false,
      message : 'Erro ao criar sala ' + error})
  }finally{
    await prisma.$disconnect();
  }
}

async function roomExists(name: string, userId: number): Promise<boolean> {
  const room = await prisma.room.findFirst({
    where: { 
      name : name,
      creatorId : userId
    }
  })
  return !!room
}