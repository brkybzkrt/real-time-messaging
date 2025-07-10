import Conversation from '../models/conversation.model.js';
import {User} from '../models/user.model.js';
import mongoose from 'mongoose';
import { getCache, setCache, deleteCache } from '../utils/redis.util.js';

export const createConversation = async (req, res) => {
  try {
    const { participants, isGroup, groupName } = req.body;
    const currentUserId = req.user._id;

    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return res.error({ statusCode: 400, errors: 'Participants are required' });
    }
    if (isGroup && !groupName) {
      return res.error({ statusCode: 400, errors: 'Group name is required for group conversations' });
    }

    const userIds = [currentUserId, ...participants.filter(id => id !== currentUserId.toString())];
    const uniqueUserIds = [...new Set(userIds)];

    const users = await User.find({ _id: { $in: uniqueUserIds } });
    if (users.length !== uniqueUserIds.length) {
      return res.error({ statusCode: 400, errors: 'Bir veya daha fazla kullanıcı bulunamadı' });
    }

    if (!isGroup && uniqueUserIds.length === 2) {
      const existingConversation = await Conversation.findOne({
        isGroup: false,
        participants: { $all: uniqueUserIds, $size: 2 }
      });

      if (existingConversation) {
        return res.success({ data: existingConversation });
      }
    }

    const newConversation = await Conversation.create({
      participants: uniqueUserIds,
      isGroup,
      groupName: isGroup ? groupName : undefined
    });

    const populatedConversation = await Conversation.findById(newConversation._id)
      .populate('participants', '_id name lastName email');

    for (const userId of uniqueUserIds) {
      await deleteCache(`user:${userId}:conversations`);
    }

    return res.success({ data: populatedConversation });
  } catch (error) {
    console.error('Konuşma oluşturma hatası:', error);
    return res.error({ errors: error.message });
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const cacheKey = `user:${userId}:conversations`;
    const cachedData = await getCache(cacheKey);
    
    if (cachedData) {
      return res.success({ data: JSON.parse(cachedData) });
    }
    
    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', '_id name lastName email')
      .sort({ updatedAt: -1 });
    
    await setCache(cacheKey, JSON.stringify(conversations), 300);
    
    return res.success({ data: conversations });
  } catch (error) {
    console.error('Konuşmaları getirme hatası:', error);
    return res.error({ errors: error.message });
  }
};
