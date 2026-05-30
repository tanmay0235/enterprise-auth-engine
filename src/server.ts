import app from './app';
import { env } from './config/env';

const startServer = async () => {
  try {
    
    const PORT= env.PORT

    app.listen(PORT,()=> {
         console.log(`🚀 Server running on port ${PORT}`);
    });
}catch (error)
 { console.error('❌ Fatal server startup error:', error);
    process.exit(1);
  }
};

startServer();