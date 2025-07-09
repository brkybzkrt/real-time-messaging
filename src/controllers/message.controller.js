import Message       from '../models/message.model.js';
import Conversation  from '../models/conversation.model.js';
import { getCache, setCache } from '../utils/redis.util.js';


export const getMessages = async (req, res) => {

  try {
    const { id: conversationId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user._id;

    // Authorization check
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.error({statusCode: 404, errors: 'Conversation not found' });
    if (!conversation.participants.includes(userId))
      return res.error({statusCode: 403, errors: 'You do not have access to this conversation' });
    
    // Cache key creation
    const cacheKey = `messages:${conversationId}:page${page}:limit${limit}`;
    
    // Cache check
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.success({data: cachedData});
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    const [total, messages] = await Promise.all([
      Message.countDocuments({ conversation: conversationId }),
      Message.find({ conversation: conversationId })
             .sort({ createdAt: -1 })
             .skip(skip)
             .limit(Number(limit))
             .populate('sender', 'name lastName email')
    ]);
    
    const responseData = {
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      items: messages
    };
    
    // Cache save (5 minute duration)
    await setCache(cacheKey, responseData, 300);
    
    res.success({data: responseData});

  } catch (error) {
    res.error({ errors: error });
  }
};
