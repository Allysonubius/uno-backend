import { RoomState } from '@prisma/client';
import { Response } from 'express';
import { prisma } from '../../prisma';
import type { RequestWithUser } from '../../types/request-with-user';

/**
 * Retorna uma lista paginada de salas abertas
 * */
export const getRooms = async (req: RequestWithUser, res: Response) => {
  const { take, skip } = req.query;

  const rooms = await prisma.room.findMany({
    include: {
      _count: {
        select: { players: true },
      },
    },
    where: {
      state: RoomState.WAITING_FOR_PLAYERS,
    },
    take: Number(take ?? 50),
    skip: Number(skip ?? 0),
  })

  if (rooms.length === 0) {
    return res.status(404).json({
      message: "Nenhuma sala encontrada.",
    });
  }
  
  const totalRooms = await prisma.room.count({
    where: {
      state: RoomState.WAITING_FOR_PLAYERS,
    },
  });

  const currentPage = Number(skip ?? 0) / Number(take ?? 50) + 1;
  const totalPages = Math.ceil(totalRooms / Number(take ?? 50));

  res.json({
    totalRooms,
    currentPage,
    totalPages,
    rooms,
  })
};
