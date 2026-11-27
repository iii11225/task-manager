const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// 初始化 Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 托管 public 静态前端文件
app.use(express.static('public'));
app.use(express.json());

// 【新增】解决 Cannot GET /，访问首页返回 public/index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// 获取任务列表，按创建时间倒序
app.get('/api/tasks', async (req, res) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json(error);
  res.json(data);
});

// 添加任务
app.post('/api/tasks', async (req, res) => {
  const { title, priority } = req.body;
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ title, priority }])
    .select();

  if (error) return res.status(500).json(error);
  res.json(data[0]);
});

// 修改任务完成状态
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const { data, error } = await supabase
    .from('tasks')
    .update({ completed })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json(error);
  res.json(data[0]);
});

// 删除任务
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json(error);
  res.json({ ok: true });
});

// 本地运行入口（Vercel部署不会执行这段）
if (require.main === module) {
  app.listen(port, () => {
    console.log(`本地服务：http://localhost:${port}`);
  });
}

module.exports = app;
