import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Calendar as CalendarIcon, Clock, Users, MapPin, Hash, User, Phone, Edit, Trash2, CheckCircle2, Clock3, UtensilsCrossed, ShoppingBag, Flame, Leaf, Plus, Minus, AlertCircle } from 'lucide-react';
import { format, parseISO, isPast, differenceInHours } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Reservation, MenuItem } from '../App';

const menuItems: { [key: string]: MenuItem[] } = {
  entradas: [
    { name: 'Ceviche Clásico', description: 'Pescado del día, limón, ají limo, cebolla roja, culantro, camote, choclo', price: 'S/ 38', image: 'https://images.unsplash.com/photo-1761314036959-42fa6eac59db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJ1dmlhbiUyMGNldmljaGUlMjBmaXNoJTIwbGltZXxlbnwxfHx8fDE3NjI0OTQxNjB8MA&ixlib=rb-4.1.0&q=80&w=1080', spicy: true },
    { name: 'Causa Limeña', description: 'Papa amarilla, ají amarillo, limón, palta, relleno de pollo/atún, mayonesa, aceituna, huevo', price: 'S/ 32', image: 'https://via.placeholder.com/400x300/FFD700/000000?text=Causa+Limena' },
    { name: 'Papa a la Huancaína', description: 'Papa sancochada, salsa de queso fresco con ají amarillo, leche/galleta, aceituna, huevo', price: 'S/ 28', image: 'https://via.placeholder.com/400x300/FFA500/000000?text=Papa+Huancaina', spicy: true, vegetarian: true },
    { name: 'Ocopa Arequipeña', description: 'Papa, salsa de huacatay con maní y queso, leche/galleta, huevo, aceituna', price: 'S/ 30', image: 'https://via.placeholder.com/400x300/90EE90/000000?text=Ocopa', vegetarian: true },
    { name: 'Choritos a la Chalaca', description: 'Choros, cebolla, tomate, choclo, ají limo, limón, culantro', price: 'S/ 35', image: 'https://via.placeholder.com/400x300/87CEEB/000000?text=Choritos+Chalaca' },
    { name: 'Tiradito al Ají Amarillo', description: 'Láminas de pescado, crema de ají amarillo, limón, aceite, sal', price: 'S/ 40', image: 'https://via.placeholder.com/400x300/FFB6C1/000000?text=Tiradito', spicy: true },
    { name: 'Anticuchos de Corazón', description: 'Corazón de res, adobo de ají panca y especias, papa, choclo, salsa de anticucho', price: 'S/ 36', image: 'https://images.unsplash.com/photo-1761315414620-7f0f3ebdd866?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpY3VjaG9zJTIwYmVlZiUyMGhlYXJ0JTIwc2tld2Vyc3xlbnwxfHx8fDE3NjI0OTQxNjN8MA&ixlib=rb-4.1.0&q=80&w=1080', spicy: true },
    { name: 'Tamal Criollo', description: 'Masa de maíz, aderezo rojo, cerdo/pollo, maní, aceituna, huevo', price: 'S/ 25', image: 'https://via.placeholder.com/400x300/F5DEB3/000000?text=Tamal+Criollo' },
    { name: 'Solterito Arequipeño', description: 'Queso fresco, habas, choclo, tomate, cebolla, aceituna, vinagreta', price: 'S/ 26', image: 'https://images.unsplash.com/photo-1708397469515-0ef890e0095f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2x0ZXJpdG8lMjBzYWxhZCUyMGNoZWVzZSUyMGJlYW5zfGVufDF8fHx8MTc2MjQ5NDE2NHww&ixlib=rb-4.1.0&q=80&w=1080', vegetarian: true },
    { name: 'Chicharrón de Calamar', description: 'Aros de calamar, harina/chuño, limón, salsa tártara', price: 'S/ 34', image: 'https://images.unsplash.com/photo-1734771219838-61863137b117?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMGNhbGFtYXJpJTIwY3Jpc3B5JTIwZ29sZGVufGVufDF8fHx8MTc2MjQ5NDE2NXww&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Leche de Tigre', description: 'Extracto de ceviche, jugo de limón, ají, cebolla, culantro, cancha', price: 'S/ 27', image: 'https://via.placeholder.com/400x300/ADD8E6/000000?text=Leche+de+Tigre', spicy: true },
  ],
  principales: [
    { name: 'Lomo Saltado', description: 'Lomo de res, cebolla, tomate, sillao, papas fritas, arroz', price: 'S/ 52', image: 'https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Lomo+Saltado' },
    { name: 'Ají de Gallina', description: 'Pollo deshilachado, crema de ají amarillo, pan/leche, nuez, queso, arroz', price: 'S/ 48', image: 'https://via.placeholder.com/400x300/FFD700/000000?text=Aji+de+Gallina', spicy: true },
    { name: 'Arroz con Pollo', description: 'Arroz, culantro licuado, pollo, cerveza negra, zanahoria, pimiento', price: 'S/ 45', image: 'https://via.placeholder.com/400x300/90EE90/000000?text=Arroz+con+Pollo' },
    { name: 'Seco de Cordero a la Norteña', description: 'Cordero, culantro, chicha de jora, loche, frijoles, arroz', price: 'S/ 65', image: 'https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Seco+Cordero' },
    { name: 'Carapulcra con Sopa Seca', description: 'Guiso de papa seca con maní y cerdo; tallarín sazonado con albahaca y aderezo', price: 'S/ 58', image: 'https://via.placeholder.com/400x300/A0522D/FFFFFF?text=Carapulcra' },
    { name: 'Arroz Chaufa de Mariscos', description: 'Arroz salteado, langostinos/calamares, huevo, cebolla china, sillao, kión', price: 'S/ 55', image: 'https://via.placeholder.com/400x300/FFA500/000000?text=Chaufa+Mariscos' },
    { name: 'Tacu Tacu con Bistec', description: 'Frijol y arroz dorados, bistec de res, salsa criolla, plátano frito', price: 'S/ 50', image: 'https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Tacu+Tacu' },
    { name: 'Cuy Chactado', description: 'Cuy entero crocante, harina/condimentos, papa dorada, ensalada', price: 'S/ 75', image: 'https://via.placeholder.com/400x300/CD853F/000000?text=Cuy+Chactado' },
    { name: 'Pachamanca Tres Carnes', description: 'Cerdo, pollo, res; hierbas andinas (huacatay, chincho), habas, choclo, papa, humitas', price: 'S/ 70', image: 'https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Pachamanca' },
    { name: 'Pollo a la Brasa', description: 'Pollo marinado, papas fritas, ensalada, cremas', price: 'S/ 42', image: 'https://via.placeholder.com/400x300/D2691E/FFFFFF?text=Pollo+Brasa' },
    { name: 'Sudado de Pescado', description: 'Pescado, chicha de jora, tomate, cebolla, ají, culantro', price: 'S/ 48', image: 'https://via.placeholder.com/400x300/FF6347/FFFFFF?text=Sudado+Pescado' },
    { name: 'Chupe de Camarones', description: 'Camarones, leche, papa, huevo, arroz, queso, huacatay', price: 'S/ 68', image: 'https://via.placeholder.com/400x300/FF7F50/000000?text=Chupe+Camarones' },
    { name: 'Cabrito a la Norteña', description: 'Cabrito, loche, chicha de jora, aderezo rojo; frijoles y arroz', price: 'S/ 72', image: 'https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Cabrito+Nortena' },
    { name: 'Adobo Arequipeño', description: 'Cerdo marinado en chicha de jora, ají panca, comino, pan, cebolla', price: 'S/ 46', image: 'https://via.placeholder.com/400x300/A52A2A/FFFFFF?text=Adobo', spicy: true },
    { name: 'Quinotto de Hongos', description: 'Quinua, hongos andinos, caldo de verduras, cebolla, ajo, queso', price: 'S/ 44', image: 'https://via.placeholder.com/400x300/F5DEB3/000000?text=Quinotto', vegetarian: true },
  ],
  postres: [
    { name: 'Suspiro a la Limeña', description: 'Manjar blanco, yemas, merengue al oporto', price: 'S/ 25', image: 'https://images.unsplash.com/photo-1752245055475-8b7c3b4756ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXJpbmd1ZSUyMGNhcmFtZWwlMjBkZXNzZXJ0JTIwZ2xhc3N8ZW58MXx8fHwxNzYyNDkzNjk3fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Mazamorra Morada', description: 'Maíz morado, frutas secas/frescas, canela, clavo', price: 'S/ 18', image: 'https://images.unsplash.com/photo-1566901889590-85481ae4de50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXJwbGUlMjBwdWRkaW5nJTIwZnJ1aXQlMjBkZXNzZXJ0fGVufDF8fHx8MTc2MjQ5MzY5N3ww&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Arroz con Leche', description: 'Arroz, leche, azúcar, canela, cáscara de limón', price: 'S/ 20', image: 'https://images.unsplash.com/photo-1606728099646-68d5a0a4d423?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwcHVkZGluZyUyMGNpbm5hbW9uJTIwYm93bHxlbnwxfHx8fDE3NjI0OTM2OTh8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Picarones', description: 'Masa de zapallo y camote, fritura, miel de chancaca', price: 'S/ 22', image: 'https://images.unsplash.com/photo-1702882238893-b42d5808a4af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb251dHMlMjBob25leSUyMHN5cnVwJTIwZnJpZWR8ZW58MXx8fHwxNzYyNDkzNjk4fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Turrón de Doña Pepa', description: 'Barras de anís, miel de frutas, grageas', price: 'S/ 26', image: 'https://images.unsplash.com/photo-1619146034835-55dcb4787c90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXllcmVkJTIwY29va2llJTIwY2FuZHklMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjI0OTM2OTl8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'King Kong', description: 'Galleta gruesa, manjar blanco, dulce de piña/maní', price: 'S/ 28', image: 'https://images.unsplash.com/photo-1661416958387-00c93ada91ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kd2ljaCUyMGNvb2tpZSUyMGR1bGNlJTIwbGVjaGV8ZW58MXx8fHwxNzYyNDkzNjk5fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Alfajores', description: 'Tapas de maicena/harina, manjar blanco, coco opcional', price: 'S/ 24', image: 'https://images.unsplash.com/photo-1661416958387-00c93ada91ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kd2ljaCUyMGNvb2tpZSUyMGR1bGNlJTIwbGVjaGV8ZW58MXx8fHwxNzYyNDkzNjk5fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Pastel Tres Leches', description: 'Bizcocho, mezcla de tres leches, crema batida', price: 'S/ 27', image: 'https://images.unsplash.com/photo-1745356979337-03a263a39beb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVzJTIwbGVjaGVzJTIwc29ha2VkJTIwY2FrZXxlbnwxfHx8fDE3NjI0OTM3MDB8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Cheesecake de Maracuyá', description: 'Base de galleta, crema de queso, coulis de maracuyá', price: 'S/ 29', image: 'https://images.unsplash.com/photo-1622322076203-25ae52e5d0c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXNzaW9uJTIwZnJ1aXQlMjBjaGVlc2VjYWtlJTIwc2xpY2V8ZW58MXx8fHwxNzYyNDkzNzAwfDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Crème Brûlée', description: 'Crema de vainilla, yemas, azúcar caramelizada', price: 'S/ 30', image: 'https://images.unsplash.com/photo-1637194502327-c99c94943680?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVtZSUyMGJydWxlZSUyMGNhcmFtZWxpemVkJTIwdG9wfGVufDF8fHx8MTc2MjQ5MzcwMHww&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Tiramisú', description: 'Bizcotelas, café, mascarpone, cacao', price: 'S/ 28', image: 'https://images.unsplash.com/photo-1727056353430-101a9d47d9b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aXJhbWlzdSUyMGRlc3NlcnQlMjBsYXllcmVkfGVufDF8fHx8MTc2MjQ5MzcwNXww&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Churros con Chocolate', description: 'Masa frita, azúcar, salsa de chocolate', price: 'S/ 23', image: 'https://images.unsplash.com/photo-1611516081814-55d97d5a7488?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVycm9zJTIwY2hvY29sYXRlJTIwZGlwcGluZyUyMHNhdWNlfGVufDF8fHx8MTc2MjQ5MzcwNXww&ixlib=rb-4.1.0&q=80&w=1080' },
  ],
  bebidas: [
    { name: 'Chicha Morada', description: 'Maíz morado, piña, canela, clavo, limón', price: 'S/ 12', image: 'https://images.unsplash.com/photo-1604232907795-1e7414976795?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXJwbGUlMjBjb3JuJTIwZHJpbmslMjBwZXJ1dmlhbnxlbnwxfHx8fDE3NjI0OTM3MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Emoliente', description: 'Cebada, linaza, cola de caballo, limón, hierbas', price: 'S/ 10', image: 'https://images.unsplash.com/photo-1762328868620-76572366d607?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiYWwlMjB0ZWElMjBob3QlMjBkcmlua3xlbnwxfHx8fDE3NjI0OTM3MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Pisco Sour', description: 'Pisco, jugo de limón, jarabe, clara de huevo, amargo', price: 'S/ 28', image: 'https://images.unsplash.com/photo-1725790803859-edc661663bb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXNjbyUyMHNvdXIlMjBjb2NrdGFpbCUyMGZvYW18ZW58MXx8fHwxNzYyNDkzNzA3fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Chilcano de Pisco', description: 'Pisco, ginger ale, limón, amargo', price: 'S/ 26', image: 'https://images.unsplash.com/photo-1757955787582-1b1ea531e1b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaW5nZXIlMjBjb2NrdGFpbCUyMHJlZnJlc2hpbmclMjBkcmlua3xlbnwxfHx8fDE3NjI0OTM3MDd8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Maracuyá Sour', description: 'Pisco, maracuyá, limón, jarabe, clara', price: 'S/ 30', image: 'https://images.unsplash.com/photo-1725790803859-edc661663bb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXNzaW9uJTIwZnJ1aXQlMjBzb3VyJTIwY29ja3RhaWx8ZW58MXx8fHwxNzYyNDkzNzA3fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Inca Kola', description: 'Gaseosa peruana sabor hierba luisa', price: 'S/ 8', image: 'https://images.unsplash.com/photo-1746635748701-81a5ae05f3dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5ZWxsb3clMjBzb2RhJTIwYm90dGxlJTIwZ2xhc3N8ZW58MXx8fHwxNzYyNDkzNzA5fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Chicha de Jora', description: 'Maíz fermentado, agua, especias', price: 'S/ 15', image: 'https://images.unsplash.com/photo-1641053336141-8b0339f48f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JuJTIwZmVybWVudGVkJTIwZHJpbmslMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NjI0OTM3MDl8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Cerveza Artesanal Peruana', description: 'Maltas, lúpulo, levadura (estilo rotativo)', price: 'S/ 18', image: 'https://images.unsplash.com/photo-1759306441537-7fae35fec66f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmFmdCUyMGJlZXIlMjBhbWJlciUyMGdsYXNzfGVufDF8fHx8MTc2MjQ5MzcwOXww&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Mate de Coca', description: 'Hojas de coca, agua caliente', price: 'S/ 8', image: 'https://images.unsplash.com/photo-1758221052634-33f352d1318b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NhJTIwbGVhZiUyMHRlYSUyMGhvdHxlbnwxfHx8fDE3NjI0OTM3MDl8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Agua con Gas', description: 'Agua mineral carbonatada', price: 'S/ 6', image: 'https://images.unsplash.com/photo-1629743094483-f1d068ddb29c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFya2xpbmclMjB3YXRlciUyMGdsYXNzJTIwYm90dGxlfGVufDF8fHx8MTc2MjQ5MzcxMHww&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Limonada Frozen', description: 'Limón, hielo, azúcar, hierbabuena', price: 'S/ 14', image: 'https://images.unsplash.com/photo-1720787714611-41dbdc75d419?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcm96ZW4lMjBsZW1vbmFkZSUyMHNsdXNoeSUyMGljZXxlbnwxfHx8fDE3NjI0OTM3MTB8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Mojito', description: 'Ron, hierbabuena, lima, azúcar, soda', price: 'S/ 24', image: 'https://images.unsplash.com/photo-1676105797000-323c37de780c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2ppdG8lMjBtaW50JTIwY29ja3RhaWwlMjBmcmVzaHxlbnwxfHx8fDE3NjI0OTM3MTF8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Caipiriña', description: 'Cachaça, lima, azúcar, hielo', price: 'S/ 25', image: 'https://images.unsplash.com/photo-1625860448256-142933059c77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWlwaXJpbmhhJTIwYnJhemlsaWFuJTIwY29ja3RhaWwlMjBsaW1lfGVufDF8fHx8MTc2MjQ5MzcxMXww&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Aperol Spritz', description: 'Aperol, prosecco, soda, naranja', price: 'S/ 27', image: 'https://images.unsplash.com/photo-1610307540315-0d3f322403ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGVyb2wlMjBzcHJpdHolMjBvcmFuZ2UlMjBkcmlua3xlbnwxfHx8fDE3NjI0OTM3MTF8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Café Peruano de Altura', description: 'Granos arábica de altura, extracción espresso/prensa', price: 'S/ 10', image: 'https://images.unsplash.com/photo-1666196389175-630e3b80ad91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJ1dmlhbiUyMGNvZmZlZSUyMGN1cCUyMGVzcHJlc3NvfGVufDF8fHx8MTc2MjQ5MzcxMnww&ixlib=rb-4.1.0&q=80&w=1080' },
  ],
};

export function ReservationHistory() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = () => {
    const stored = localStorage.getItem('reservations');
    if (stored) {
      const parsed: Reservation[] = JSON.parse(stored);
      // Update status based on date
      const updated = parsed.map(res => ({
        ...res,
        status: isPast(parseISO(`${res.date}T${res.time}`)) ? 'concluido' as const : 'en proceso' as const
      }));
      setReservations(updated);
      localStorage.setItem('reservations', JSON.stringify(updated));
    }
  };

  const handleDelete = (id: string) => {
    const updated = reservations.filter(res => res.id !== id);
    localStorage.setItem('reservations', JSON.stringify(updated));
    setReservations(updated);
    toast.success('Reserva eliminada exitosamente');
  };

  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (updatedReservation: Reservation) => {
    const updated = reservations.map(res =>
      res.id === updatedReservation.id ? updatedReservation : res
    );
    localStorage.setItem('reservations', JSON.stringify(updated));
    setReservations(updated);
    setIsEditDialogOpen(false);
    toast.success('Reserva actualizada exitosamente');
  };

  const sortedReservations = [...reservations].sort((a, b) => {
    const dateA = parseISO(`${a.date}T${a.time}`);
    const dateB = parseISO(`${b.date}T${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });

  if (reservations.length === 0) {
    return (
      <Card className="max-w-4xl mx-auto shadow-lg border-slate-200">
        <CardContent className="pt-10 pb-10 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
              <Clock3 className="w-10 h-10 text-slate-400" />
            </div>
            <div>
              <h3 className="text-slate-900 mb-2">No hay reservas</h3>
              <p className="text-slate-600">Aún no has realizado ninguna reserva</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-slate-200">
          <CardTitle className="text-slate-900">Historial de Reservas</CardTitle>
          <CardDescription>Gestiona tus reservas</CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {sortedReservations.map((reservation) => (
          <Card key={reservation.id} className="shadow-md border-slate-200 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-900">{reservation.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-4 h-4" />
                        <span>{reservation.customerPhone}</span>
                      </div>
                    </div>
                    <Badge
                      variant={reservation.status === 'concluido' ? 'secondary' : 'default'}
                      className={reservation.status === 'concluido' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                    >
                      {reservation.status === 'concluido' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Concluido
                        </>
                      ) : (
                        <>
                          <Clock3 className="w-3 h-3 mr-1" />
                          En Proceso
                        </>
                      )}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-slate-600">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{format(parseISO(reservation.date), 'PPP', { locale: es })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{reservation.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{reservation.guests} {reservation.guests === 1 ? 'persona' : 'personas'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      <span>Mesa {reservation.tableNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin className="w-4 h-4" />
                      <span>{reservation.location}</span>
                    </div>
                  </div>

                  {/* Pre-Order Information */}
                  {reservation.orderType && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-slate-700">
                          {reservation.orderType === 'pre-order' ? 'Pre-Orden Confirmada' : 'Ordenar en el Restaurante'}
                        </span>
                      </div>
                      {reservation.orderType === 'pre-order' && reservation.preOrderItems && reservation.preOrderItems.length > 0 && (
                        <div className="bg-emerald-50 rounded-lg p-3 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-emerald-700 mb-2">
                            <ShoppingBag className="w-4 h-4" />
                            <span className="font-medium">{reservation.preOrderItems.length} platillos ordenados</span>
                          </div>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {reservation.preOrderItems.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-slate-700">
                                  {item.quantity}x {item.name}
                                </span>
                                <span className="text-emerald-600 font-medium">{item.price}</span>
                              </div>
                            ))}
                          </div>
                          <div className="pt-2 border-t border-emerald-200 flex justify-between">
                            <span className="text-sm font-semibold text-slate-900">Total:</span>
                            <span className="text-sm font-semibold text-emerald-600">
                              S/ {reservation.preOrderItems.reduce((sum, item) => {
                                const price = parseFloat(item.price.replace('S/', '').trim());
                                return sum + price * item.quantity;
                              }, 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col gap-2">
                  <Dialog open={isEditDialogOpen && editingReservation?.id === reservation.id} onOpenChange={(open) => {
                    setIsEditDialogOpen(open);
                    if (!open) setEditingReservation(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(reservation)}
                        disabled={reservation.status === 'concluido'}
                        className="gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Editar Reserva</DialogTitle>
                        <DialogDescription>Modifica los detalles de tu reserva</DialogDescription>
                      </DialogHeader>
                      {editingReservation && (
                        <EditReservationForm
                          reservation={editingReservation}
                          onSave={handleSaveEdit}
                          onCancel={() => setIsEditDialogOpen(false)}
                        />
                      )}
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="gap-2">
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar reserva?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. La reserva será eliminada permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(reservation.id)}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

interface EditReservationFormProps {
  reservation: Reservation;
  onSave: (reservation: Reservation) => void;
  onCancel: () => void;
}

function EditReservationForm({ reservation, onSave, onCancel }: EditReservationFormProps) {
  const [date, setDate] = useState<Date>(parseISO(reservation.date));
  const [time, setTime] = useState(reservation.time);
  const [guests, setGuests] = useState(reservation.guests.toString());
  const [location, setLocation] = useState(reservation.location);
  const [tableNumber, setTableNumber] = useState(reservation.tableNumber);
  const [customerName, setCustomerName] = useState(reservation.customerName);
  const [customerPhone, setCustomerPhone] = useState(reservation.customerPhone);
  const [preOrderItems, setPreOrderItems] = useState<Array<MenuItem & { quantity: number }>>(reservation.preOrderItems || []);

  // Calculate hours until reservation
  const reservationDateTime = parseISO(`${reservation.date}T${reservation.time}`);
  const hoursUntilReservation = differenceInHours(reservationDateTime, new Date());
  const canModifyMenu = hoursUntilReservation >= 36;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time || !location || !tableNumber || !customerName || !customerPhone) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const updatedReservation: Reservation = {
      ...reservation,
      date: format(date, 'yyyy-MM-dd'),
      time,
      guests: parseInt(guests),
      location,
      tableNumber,
      customerName,
      customerPhone,
      preOrderItems,
      status: isPast(parseISO(`${format(date, 'yyyy-MM-dd')}T${time}`)) ? 'concluido' : 'en proceso',
    };

    onSave(updatedReservation);
  };

  const addToPreOrder = (item: MenuItem) => {
    const existing = preOrderItems.find((i) => i.name === item.name);
    if (existing) {
      setPreOrderItems(
        preOrderItems.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setPreOrderItems([...preOrderItems, { ...item, quantity: 1 }]);
    }
    toast.success(`${item.name} agregado a la pre-orden`);
  };

  const updateQuantity = (name: string, quantity: number) => {
    if (quantity === 0) {
      setPreOrderItems(preOrderItems.filter((item) => item.name !== name));
      return;
    }
    setPreOrderItems(
      preOrderItems.map((item) =>
        item.name === name ? { ...item, quantity } : item
      )
    );
  };

  const removeFromPreOrder = (name: string) => {
    setPreOrderItems(preOrderItems.filter((item) => item.name !== name));
  };

  const preOrderTotal = preOrderItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('S/', '').trim());
    return sum + price * item.quantity;
  }, 0);

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
  ];

  const locations = [
    'Sede Centro Histórico',
    'Sede Zona Rosa',
    'Sede Polanco',
    'Sede Santa Fe'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Detalles de Reserva</TabsTrigger>
          <TabsTrigger value="menu">Modificar Menú</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6 mt-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-customerName" className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" />
                Nombre Completo
              </Label>
              <Input
                id="edit-customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-customerPhone" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500" />
                Teléfono
              </Label>
              <Input
                id="edit-customerPhone"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-slate-500" />
                Fecha
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    {format(date, 'PPP', { locale: es })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-time" className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                Hora
              </Label>
              <Select value={time} onValueChange={setTime} required>
                <SelectTrigger id="edit-time">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-guests" className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" />
                Número de Personas
              </Label>
              <Select value={guests} onValueChange={setGuests} required>
                <SelectTrigger id="edit-guests">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 68 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'persona' : 'personas'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                Sede
              </Label>
              <Select value={location} onValueChange={setLocation} required>
                <SelectTrigger id="edit-location">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-tableNumber" className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-slate-500" />
              Número de Mesa
            </Label>
            <Select value={tableNumber} onValueChange={setTableNumber} required>
              <SelectTrigger id="edit-tableNumber">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    Mesa {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="menu" className="space-y-6 mt-6">
          {!canModifyMenu && (
            <Alert variant="destructive" className="border-red-300 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>No se puede modificar el menú:</strong> La modificación del menú solo está permitida con un mínimo de 36 horas de anticipación. 
                Tu reserva es en {hoursUntilReservation} {hoursUntilReservation === 1 ? 'hora' : 'horas'}.
              </AlertDescription>
            </Alert>
          )}

          {canModifyMenu && (
            <Alert className="border-blue-300 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900">
                Puedes modificar tu pre-orden. Faltan {hoursUntilReservation} horas para tu reserva.
              </AlertDescription>
            </Alert>
          )}

          {/* Pre-order Cart */}
          {preOrderItems.length > 0 && (
            <Card className="bg-emerald-50 border-emerald-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-emerald-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Tu Pre-Orden Actual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {preOrderItems.map((item) => (
                  <div key={item.name} className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <div className="flex-1">
                      <p className="text-slate-900">{item.name}</p>
                      <p className="text-sm text-emerald-600 font-medium">{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.name, item.quantity - 1)}
                        disabled={!canModifyMenu}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.name, item.quantity + 1)}
                        disabled={!canModifyMenu}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromPreOrder(item.name)}
                        disabled={!canModifyMenu}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-emerald-200 flex justify-between items-center">
                  <span className="font-semibold text-slate-900">Total:</span>
                  <span className="font-semibold text-emerald-600">S/ {preOrderTotal.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Menu Items */}
          {canModifyMenu && (
            <Tabs defaultValue="entradas" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="entradas">Entradas</TabsTrigger>
                <TabsTrigger value="principales">Principales</TabsTrigger>
                <TabsTrigger value="postres">Postres</TabsTrigger>
                <TabsTrigger value="bebidas">Bebidas</TabsTrigger>
              </TabsList>

              {Object.entries(menuItems).map(([category, items]) => (
                <TabsContent key={category} value={category} className="mt-4">
                  <div className="grid gap-4 sm:grid-cols-2 max-h-96 overflow-y-auto pr-2">
                    {items.map((item) => (
                      <Card key={item.name} className="overflow-hidden">
                        <div className="flex gap-3 p-3">
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="text-sm text-slate-900 truncate">{item.name}</p>
                                <p className="text-xs text-slate-600 line-clamp-1">{item.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-sm text-emerald-600 font-medium">{item.price}</span>
                                  {item.spicy && <Flame className="w-3 h-3 text-orange-500" />}
                                  {item.vegetarian && <Leaf className="w-3 h-3 text-green-500" />}
                                </div>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => addToPreOrder(item)}
                                className="bg-emerald-600 hover:bg-emerald-700 flex-shrink-0"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
}
