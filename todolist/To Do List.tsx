import React ,{ useState } from 'react';
import './Todolist.css';

interface Todo{
    id:number,
    text:string,
    isSelected:boolean,
    isDone:boolean;
}

function Todolist(){
    const [todos,setTodos] = useState<Todo[]>([]);
    const [inputText,setInputText] = useState('');
    const [isDeleteMode,setIsDeleteMode] = useState(false);
    const [selected,setSelected] = useState<Todo | null>(null);

    //添加待办任务
    const addTodo = () => {
        const text = inputText.trim();
        if(!text)return;
        setTodos([
            {id:Date.now(),text,isSelected:false,isDone:false},
            ...todos
        ]);
        setInputText('');
    }

    // 回车发送功能
    const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter')addTodo();
    }


    // 删除模式开关
    const toggleDeleteMode = () => {
        const newDeleteMode = !isDeleteMode;
        setIsDeleteMode(newDeleteMode);
        if(isDeleteMode){
            setTodos(todos.map(x => ({...x,isSelected:false})));
            setSelected(null);
            alert('已关闭删除模式');
        }
        else{
            alert('已开启删除模式，点击任务即可删除');
        }
    }

    // 点击item
    const handleLiClick = (todo:Todo) => {
        
        if(isDeleteMode){
            // 删除
            const newTodos = todos.filter(x => x.id !== todo.id);
            setTodos(newTodos);
            setSelected(null);
            return;
        }
        // 高亮
        setSelected(todo)
        // 其他取消选中
        setTodos(
            todos.map(x =>({
                ...x,
                isSelected:x.id === todo.id
            }))
        )
    }

    

    // 修改
    const editTodo = () => {
        if(!selected){
            alert('请先选中要修改的任务');
            return;
        }
        const newText = prompt('请输入新内容： ',selected.text)?.trim();
        if(!newText)return;
        setTodos(
            todos.map(x => x.id === selected.id?{...x,text:newText}:x)
        );
        setSelected({...selected,text:newText});
    }

    // 完成任务
    const doneTodo = () =>{
        if(!selected){
            alert('请选择完成的任务,再点击按钮')
            return;
        }
        const newtodos = todos.map(x => x.id === selected.id?{...x,isDone:!x.isDone}:x);

        // 将完成的任务排序至最后
        const sTodos = [...newtodos];
        sTodos.sort((a,b) => {
            if(a.isDone && !b.isDone) return 1;
            if(!a.isDone && b.isDone) return -1;
            return 0;
        });
        setTodos(sTodos);
        setSelected(null);
    }

    
    // 清空
    const clearTodo = () =>{
        setTodos(todos.filter(x => x.isDone === false ? x :''));
    }


    return(
        <div id='head'>
            <h1>
                <span className='iconfont icon-list'></span>
                To Do List 
                <span className='f1'></span>
                <span className='f2'></span>
                <span className='f3'></span>
                <span className='f4'></span>
                <span className='f5'></span>
            </h1>
            <div className='date'>
                日期：{new Date().toLocaleDateString('zh-CN',{
                    year:'numeric',
                    month:'long',
                    day:'numeric',
                    weekday:'long'
                })}
            </div>
            <div id='text'>
                <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="请输入要添加的任务"
                />
                <button onClick={addTodo}>添加</button>
                
            </div>
            <ul id='fn'>
                <li className='delete' onClick={toggleDeleteMode}>
                <span className='iconfont icon-shanchu'></span>
                {isDeleteMode?'关闭删除模式':'开启删除模式'}
                </li>
                <li className='change' onClick={editTodo}>
                    <span className='iconfont icon-xiugai'></span>
                    修改
                </li>
                <li className='done' onClick={doneTodo}>
                    <span className='iconfont icon-shouye'></span>
                    完成任务
                </li>
                <li className='clear' onClick={clearTodo}>
                    <span className='iconfont icon-qingkong'></span>
                    清空已完成任务
                </li>
            </ul>
            <ul id='list'>
                {todos.map((todo) =>(
                    <li
                    key={todo.id}
                    className={`${todo.isSelected ? 'selected' : ''}`}
                    onClick={() => handleLiClick(todo)}
                    style={{
                        textDecoration: todo.isDone ? "line-through" : "none",
                        color:todo.isDone ? "#999" : "#333",
                    }}
                    >
                        {todo.text}
                    </li>
                ))}
            </ul>
            <ul id="fn"></ul>
        </div>
    )
}
export default Todolist;