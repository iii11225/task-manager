const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 你的supabase信息
const SUPABASE_URL = "https://hecrijeunjzioftkuusc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_G9maCNaZbuiMks1xdIVRog_mfJS6qwY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 获取任务列表（按创建时间倒序）
app.get('/api/tasks', async (req, res) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
  res.json({ data, error });
});

// 添加任务
app.post('/api/tasks', async (req, res) => {
  const { title, priority } = req.body;
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ title, priority }])
    .select();
  res.json({ data, error });
});

// 修改完成状态
app.patch('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const { data, error } = await supabase
    .from('tasks')
    .update({ completed })
    .eq('id', id)
    .select();
  res.json({ data, error });
});

// 删除任务
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  res.json({ data, error });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务启动在端口 ${PORT}`);
});
