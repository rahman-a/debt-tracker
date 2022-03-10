import style from './Chat.module.scss';
import {Conversation, ChatSidebar} from '../../components'


function Chat() {
  return (
    <div className={style.chat}>
      <div className={style.chat__container}>
        <ChatSidebar/>
        <Conversation/>
      </div>
    </div>
  );
}

export default Chat;