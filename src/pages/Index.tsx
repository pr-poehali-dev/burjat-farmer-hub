import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/b1429699-24cc-47c0-ac2c-c3f29f1d2be7/files/129ffa05-f2df-485c-be8d-3b04919a0210.jpg';
const PATTERN_IMG =
  'https://cdn.poehali.dev/projects/b1429699-24cc-47c0-ac2c-c3f29f1d2be7/files/c69698cf-3cb9-4dc0-9899-99d69d187fd5.jpg';
const MARKET_IMG =
  'https://cdn.poehali.dev/projects/b1429699-24cc-47c0-ac2c-c3f29f1d2be7/files/be09957f-be04-4f57-9255-5d7014bcd8b9.jpg';

const YANDEX_MAP = 'https://yandex.ru/maps/org/kaskad/172351542238/';

// TODO: замените на реальные контакты менеджера
const TELEGRAM_MANAGER = 'https://t.me/kaskad_market';
const WHATSAPP_MANAGER = '79000000000';

type Product = {
  id: number;
  name: string;
  seller: string;
  price: number;
  unit: string;
  category: string;
  emoji: string;
};

const CATEGORIES = [
  { id: 'all', label: 'Всё', icon: 'LayoutGrid' },
  { id: 'meat', label: 'Мясо', icon: 'Beef' },
  { id: 'dairy', label: 'Молочка', icon: 'Milk' },
  { id: 'honey', label: 'Мёд', icon: 'Hexagon' },
  { id: 'bakery', label: 'Выпечка', icon: 'Croissant' },
  { id: 'handmade', label: 'Hand-made', icon: 'Sparkles' },
];

const PRODUCTS: Product[] = [
  { id: 1, name: 'Баранина фермерская', seller: 'Хозяйство Дондоковых', price: 780, unit: 'кг', category: 'meat', emoji: '🥩' },
  { id: 2, name: 'Говядина степная', seller: 'Ранчо «Тугнуй»', price: 690, unit: 'кг', category: 'meat', emoji: '🐄' },
  { id: 3, name: 'Буузы домашние', seller: 'Кухня Сэсэг', price: 450, unit: '10 шт', category: 'meat', emoji: '🥟' },
  { id: 4, name: 'Молоко цельное', seller: 'Ферма Бадмаевых', price: 120, unit: 'литр', category: 'dairy', emoji: '🥛' },
  { id: 5, name: 'Сметана деревенская', seller: 'Ферма Бадмаевых', price: 260, unit: '0.5 кг', category: 'dairy', emoji: '🥣' },
  { id: 6, name: 'Творог фермерский', seller: 'Подворье Очировых', price: 340, unit: 'кг', category: 'dairy', emoji: '🧀' },
  { id: 7, name: 'Мёд таёжный', seller: 'Пасека Гомбоева', price: 950, unit: 'кг', category: 'honey', emoji: '🍯' },
  { id: 8, name: 'Мёд с прополисом', seller: 'Пасека Гомбоева', price: 1100, unit: 'кг', category: 'honey', emoji: '🐝' },
  { id: 9, name: 'Хлеб на закваске', seller: 'Пекарня «Гэсэр»', price: 180, unit: 'шт', category: 'bakery', emoji: '🍞' },
  { id: 10, name: 'Боовы к чаю', seller: 'Пекарня «Гэсэр»', price: 220, unit: '0.5 кг', category: 'bakery', emoji: '🥠' },
  { id: 11, name: 'Изделия из войлока', seller: 'Мастерская Аюны', price: 1500, unit: 'шт', category: 'handmade', emoji: '🧶' },
  { id: 12, name: 'Оберег «Хадак»', seller: 'Мастерская Аюны', price: 800, unit: 'шт', category: 'handmade', emoji: '🎗️' },
];

const NAV = [
  { id: 'home', label: 'Главная' },
  { id: 'catalog', label: 'Каталог' },
  { id: 'how', label: 'Как это работает' },
  { id: 'events', label: 'Афиша' },
  { id: 'seller', label: 'Стать продавцом' },
  { id: 'contacts', label: 'Контакты' },
];

const EVENTS = [
  { date: '14 фев', title: 'Сагаалган — Белый месяц', desc: 'Большая ярмарка к бурятскому Новому году. Национальная кухня, подарки, концерт.' },
  { date: '5 апр', title: 'Весенняя сельхозярмарка', desc: 'Рассада, саженцы, свежая зелень от фермеров региона.' },
  { date: '20 июл', title: 'Медовый спас', desc: 'Дегустация мёда с пасек Бурятии, продукты пчеловодства.' },
  { date: '13 сен', title: 'Урожай Забайкалья', desc: 'Осенняя ярмарка овощей, заготовок и мясных деликатесов.' },
];

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

export default function Index() {
  const [activeCat, setActiveCat] = useState('all');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const filtered = useMemo(
    () => (activeCat === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCat)),
    [activeCat]
  );

  const cartItems = useMemo(
    () => PRODUCTS.filter((p) => cart[p.id] > 0).map((p) => ({ ...p, qty: cart[p.id] })),
    [cart]
  );
  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cartItems.reduce((s, i) => s + i.qty, 0);

  const add = (id: number) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const dec = (id: number) =>
    setCart((c) => {
      const n = (c[id] || 0) - 1;
      const copy = { ...c };
      if (n <= 0) delete copy[id];
      else copy[id] = n;
      return copy;
    });

  const buildOrderText = () => {
    let t = 'Здравствуйте! Хочу оформить заказ на рынке «Каскад»:%0A%0A';
    cartItems.forEach((i) => {
      t += `• ${i.name} (${i.seller}) — ${i.qty} × ${i.price}₽ = ${i.qty * i.price}₽%0A`;
    });
    t += `%0AИтого: ${total}₽%0A%0AИмя: ${name || '—'}%0AТелефон: ${phone || '—'}`;
    if (comment) t += `%0AКомментарий: ${comment}`;
    return t;
  };

  const validate = () => {
    if (cartItems.length === 0) {
      toast({ title: 'Корзина пуста', description: 'Добавьте товары в заказ' });
      return false;
    }
    if (!name || !phone) {
      toast({ title: 'Заполните данные', description: 'Укажите имя и телефон для связи' });
      return false;
    }
    return true;
  };

  const sendTelegram = () => {
    if (!validate()) return;
    window.open(`${TELEGRAM_MANAGER}?text=${buildOrderText()}`, '_blank');
  };
  const sendWhatsapp = () => {
    if (!validate()) return;
    window.open(`https://wa.me/${WHATSAPP_MANAGER}?text=${buildOrderText()}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border">
        <div className="buryat-border h-1.5" />
        <div className="container flex items-center justify-between h-16">
          <button onClick={() => scrollTo('home')} className="flex items-center gap-2">
            <span className="grid place-items-center w-9 h-9 rounded-md bg-primary text-primary-foreground font-display font-bold text-lg">
              К
            </span>
            <div className="text-left leading-none">
              <div className="font-display font-bold text-lg tracking-wide">КАСКАД</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest">рынок Бурятии</div>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-6">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <CartSheet
              cartItems={cartItems}
              count={count}
              total={total}
              add={add}
              dec={dec}
              name={name}
              phone={phone}
              comment={comment}
              setName={setName}
              setPhone={setPhone}
              setComment={setComment}
              sendTelegram={sendTelegram}
              sendWhatsapp={sendWhatsapp}
            />
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Icon name="Menu" size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="font-display">Меню</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 mt-6">
                  {NAV.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        scrollTo(n.id);
                        setMenuOpen(false);
                      }}
                      className="text-left py-3 px-3 rounded-md hover:bg-muted font-medium"
                    >
                      {n.label}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Фермерский рынок Каскад" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(20_40%_10%/0.85)] via-[hsl(20_40%_10%/0.6)] to-transparent" />
        </div>
        <div className="container relative py-24 md:py-36">
          <div className="max-w-2xl animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold text-[hsl(20_40%_15%)] text-xs font-semibold uppercase tracking-widest mb-6">
              <Icon name="Wheat" size={14} /> Поддержка бурятских фермеров
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-[hsl(40_44%_98%)] leading-tight mb-5">
              Свежие продукты <br /> от фермеров Бурятии
            </h1>
            <p className="text-lg text-[hsl(40_30%_88%)] mb-8 max-w-xl">
              «Каскад» — рынок, где встречаются местные хозяйства и покупатели.
              Мясо, молочка, мёд и выпечка — с доставкой к вашему столу.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="text-base" onClick={() => scrollTo('catalog')}>
                <Icon name="ShoppingBasket" size={20} className="mr-2" />
                Заказать доставку
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base bg-transparent border-[hsl(40_44%_98%)] text-[hsl(40_44%_98%)] hover:bg-[hsl(40_44%_98%)] hover:text-primary"
                onClick={() => scrollTo('how')}
              >
                Как это работает
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-16 bg-teal text-[hsl(40_44%_98%)]">
        <div className="container grid md:grid-cols-3 gap-8">
          {[
            { icon: 'HandHeart', title: 'Поддержка фермеров', desc: 'Каждая покупка помогает местным хозяйствам Бурятии развиваться.' },
            { icon: 'Leaf', title: 'Натуральные продукты', desc: 'Никакой химии — только свежее с ферм и подворий региона.' },
            { icon: 'Truck', title: 'Быстрая доставка', desc: 'Привезём заказ по Улан-Удэ или подготовим к самовывозу.' },
          ].map((f, i) => (
            <div key={i} className="flex gap-4">
              <div className="grid place-items-center shrink-0 w-12 h-12 rounded-lg bg-gold text-[hsl(20_40%_15%)]">
                <Icon name={f.icon} size={24} />
              </div>
              <div>
                <h3 className="font-display font-semibold text-xl mb-1">{f.title}</h3>
                <p className="text-sm text-[hsl(40_30%_85%)]">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalog" className="py-20">
        <div className="container">
          <SectionTitle sub="Каталог" title="Товары от продавцов «Каскада»" />
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  activeCat === c.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border hover:border-primary'
                }`}
              >
                <Icon name={c.icon} size={16} />
                {c.label}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl transition-shadow animate-scale-in"
              >
                <div className="relative h-40 bg-muted grid place-items-center text-6xl">
                  <span className="group-hover:scale-110 transition-transform">{p.emoji}</span>
                  <div className="buryat-border absolute bottom-0 left-0 right-0 h-1" />
                </div>
                <div className="p-5">
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Icon name="Store" size={12} /> {p.seller}
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-3">{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="font-display text-xl font-bold text-primary">
                      {p.price}₽ <span className="text-sm font-body font-normal text-muted-foreground">/ {p.unit}</span>
                    </div>
                    {cart[p.id] ? (
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => dec(p.id)}>
                          <Icon name="Minus" size={16} />
                        </Button>
                        <span className="w-6 text-center font-semibold">{cart[p.id]}</span>
                        <Button size="icon" className="h-8 w-8" onClick={() => add(p.id)}>
                          <Icon name="Plus" size={16} />
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" onClick={() => add(p.id)}>
                        <Icon name="Plus" size={16} className="mr-1" /> В заказ
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how"
        className="py-20 relative"
        style={{ backgroundImage: `linear-gradient(hsl(var(--muted)/0.94), hsl(var(--muted)/0.94)), url(${PATTERN_IMG})`, backgroundSize: 'cover' }}
      >
        <div className="container">
          <SectionTitle sub="Как это работает" title="Просто оформить, приятно получить" />
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { n: '01', t: 'Выберите товары', d: 'Соберите заказ из каталога — от разных фермеров сразу.' },
              { n: '02', t: 'Отправьте заявку', d: 'Заявка уходит менеджеру в Telegram или WhatsApp.' },
              { n: '03', t: 'Подтверждение', d: 'Менеджер свяжется, уточнит детали и сумму.' },
              { n: '04', t: 'Доставка / самовывоз', d: 'Привезём по городу или заберёте на рынке.' },
            ].map((s) => (
              <div key={s.n} className="bg-card rounded-xl p-6 border border-border">
                <div className="font-display text-3xl font-bold text-gold mb-2">{s.n}</div>
                <h3 className="font-display font-semibold text-lg mb-1">{s.t}</h3>
                <p className="text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: 'MapPin', t: 'Зоны доставки', d: 'По Улан-Удэ — от 200₽, пригород по договорённости.' },
              { icon: 'Clock', t: 'Сроки', d: 'Заказ до 12:00 — доставка в тот же день.' },
              { icon: 'Wallet', t: 'Минимальная сумма', d: 'Заказ от 1000₽. Самовывоз — без ограничений.' },
            ].map((x, i) => (
              <div key={i} className="flex gap-3 items-start bg-card/60 rounded-lg p-4 border border-border">
                <Icon name={x.icon} size={22} className="text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">{x.t}</div>
                  <p className="text-sm text-muted-foreground">{x.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section id="events" className="py-20">
        <div className="container">
          <SectionTitle sub="Афиша" title="Ярмарки на «Каскаде»" />
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {EVENTS.map((e, i) => (
              <div key={i} className="flex gap-5 bg-card rounded-xl p-5 border border-border hover:shadow-lg transition-shadow">
                <div className="shrink-0 grid place-content-center w-20 rounded-lg bg-teal text-[hsl(40_44%_98%)] text-center py-3">
                  <div className="font-display font-bold text-lg leading-none">{e.date.split(' ')[0]}</div>
                  <div className="text-xs uppercase tracking-wide">{e.date.split(' ')[1]}</div>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg mb-1">{e.title}</h3>
                  <p className="text-sm text-muted-foreground">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BECOME SELLER */}
      <section id="seller" className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="buryat-border absolute top-0 left-0 right-0 h-1.5" />
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold text-[hsl(20_40%_15%)] text-xs font-semibold uppercase tracking-widest mb-5">
              <Icon name="Handshake" size={14} /> Для фермеров и мастеров
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Станьте продавцом на «Каскаде»</h2>
            <p className="text-[hsl(40_30%_90%)] mb-6">
              Мы помогаем местным хозяйствам находить покупателей. Аренда торгового места,
              высокий трафик и продвижение через сайт и ярмарки — всё для вашего роста.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Более 5000 посетителей рынка в месяц',
                'Выгодные условия аренды торговых мест',
                'Продвижение через сайт и афишу ярмарок',
                'Поддержка от Минсельхозпрода Бурятии',
              ].map((x, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Icon name="Check" size={18} className="text-gold shrink-0" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              className="bg-gold text-[hsl(20_40%_15%)] hover:bg-gold/90"
              onClick={() => scrollTo('contacts')}
            >
              Оставить заявку на аренду
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { n: '5000+', l: 'посетителей / мес' },
              { n: '40+', l: 'фермеров-партнёров' },
              { n: '6', l: 'ярмарок в год' },
              { n: '15 лет', l: 'на рынке региона' },
            ].map((s, i) => (
              <div key={i} className="bg-[hsl(40_44%_98%/0.1)] rounded-xl p-6 text-center border border-[hsl(40_44%_98%/0.15)]">
                <div className="font-display text-3xl font-bold text-gold mb-1">{s.n}</div>
                <div className="text-sm text-[hsl(40_30%_88%)]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-20">
        <div className="container grid md:grid-cols-2 gap-12">
          <div>
            <SectionTitle sub="Контакты" title="Свяжитесь с нами" align="left" />
            <div className="rounded-xl overflow-hidden border border-border mb-6 relative">
              <img src={MARKET_IMG} alt="Рынок Каскад внутри" className="w-full h-52 object-cover" />
              <div className="buryat-border absolute bottom-0 left-0 right-0 h-1" />
            </div>
            <div className="space-y-5">
              {[
                { icon: 'MapPin', t: 'Адрес', d: 'г. Улан-Удэ, ул. Трубачеева, 156 (2 этаж)' },
                { icon: 'Clock', t: 'Часы работы', d: 'Ежедневно 10:00 — 20:00' },
                { icon: 'Beef', t: 'На рынке', d: 'Свежее мясо, сортовой разруб, молочка, мёд' },
              ].map((c, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="grid place-items-center w-11 h-11 rounded-lg bg-muted text-primary shrink-0">
                    <Icon name={c.icon} size={20} />
                  </div>
                  <div>
                    <div className="font-semibold">{c.t}</div>
                    <div className="text-muted-foreground">{c.d}</div>
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button variant="outline" onClick={() => window.open(YANDEX_MAP, '_blank')}>
                  <Icon name="Map" size={18} className="mr-2" /> На Яндекс.Картах
                </Button>
                <Button variant="outline" onClick={() => window.open(TELEGRAM_MANAGER, '_blank')}>
                  <Icon name="Send" size={18} className="mr-2" /> Telegram
                </Button>
                <Button variant="outline" onClick={() => window.open(`https://wa.me/${WHATSAPP_MANAGER}`, '_blank')}>
                  <Icon name="MessageCircle" size={18} className="mr-2" /> WhatsApp
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-7">
            <h3 className="font-display font-semibold text-xl mb-4">Написать нам</h3>
            <div className="space-y-4">
              <Input placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Textarea placeholder="Сообщение" value={comment} onChange={(e) => setComment(e.target.value)} rows={4} />
              <Button className="w-full" onClick={sendTelegram}>
                <Icon name="Send" size={18} className="mr-2" /> Отправить в Telegram
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-teal text-[hsl(40_30%_88%)] pt-12 pb-8">
        <div className="buryat-border h-1.5 mb-12" />
        <div className="container flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-sm">
            <div className="font-display font-bold text-2xl text-[hsl(40_44%_98%)] mb-3">КАСКАД</div>
            <p className="text-sm">
              Рынок фермерских продуктов Бурятии. Поддерживаем местные хозяйства и приносим
              свежее к вашему столу.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-2">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => scrollTo(n.id)} className="text-sm hover:text-gold transition-colors">
                {n.label}
              </button>
            ))}
          </div>
        </div>
        <div className="container mt-10 pt-6 border-t border-[hsl(40_44%_98%/0.15)] text-xs">
          © 2026 Рынок «Каскад». Все права защищены.
        </div>
      </footer>
    </div>
  );
}

function SectionTitle({ sub, title, align = 'center' }: { sub: string; title: string; align?: 'center' | 'left' }) {
  return (
    <div className={`mb-10 ${align === 'center' ? 'text-center' : ''}`}>
      <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">{sub}</span>
      <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
      <div className={`buryat-border h-1 w-24 rounded-full mt-4 ${align === 'center' ? 'mx-auto' : ''}`} />
    </div>
  );
}

type CartProps = {
  cartItems: (Product & { qty: number })[];
  count: number;
  total: number;
  add: (id: number) => void;
  dec: (id: number) => void;
  name: string;
  phone: string;
  comment: string;
  setName: (v: string) => void;
  setPhone: (v: string) => void;
  setComment: (v: string) => void;
  sendTelegram: () => void;
  sendWhatsapp: () => void;
};

function CartSheet(p: CartProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="relative">
          <Icon name="ShoppingBasket" size={20} />
          <span className="hidden sm:inline ml-2">Заказ</span>
          {p.count > 0 && (
            <span className="absolute -top-2 -right-2 grid place-items-center w-5 h-5 rounded-full bg-gold text-[hsl(20_40%_15%)] text-xs font-bold">
              {p.count}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display flex items-center gap-2">
            <Icon name="ShoppingBasket" size={20} /> Ваш заказ
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {p.cartItems.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <Icon name="ShoppingBasket" size={48} className="mx-auto mb-3 opacity-40" />
              <p>Корзина пуста</p>
              <p className="text-sm">Добавьте товары из каталога</p>
            </div>
          ) : (
            p.cartItems.map((i) => (
              <div key={i.id} className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
                <span className="text-2xl">{i.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{i.name}</div>
                  <div className="text-xs text-muted-foreground">{i.price}₽ / {i.unit}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => p.dec(i.id)}>
                    <Icon name="Minus" size={14} />
                  </Button>
                  <span className="w-5 text-center text-sm font-semibold">{i.qty}</span>
                  <Button size="icon" className="h-7 w-7" onClick={() => p.add(i.id)}>
                    <Icon name="Plus" size={14} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {p.cartItems.length > 0 && (
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex justify-between font-display text-lg font-bold">
              <span>Итого:</span>
              <span className="text-primary">{p.total}₽</span>
            </div>
            <Input placeholder="Ваше имя" value={p.name} onChange={(e) => p.setName(e.target.value)} />
            <Input placeholder="Телефон" value={p.phone} onChange={(e) => p.setPhone(e.target.value)} />
            <Textarea
              placeholder="Комментарий к заказу (адрес, время)"
              value={p.comment}
              onChange={(e) => p.setComment(e.target.value)}
              rows={2}
            />
            <Button className="w-full" onClick={p.sendTelegram}>
              <Icon name="Send" size={18} className="mr-2" /> Отправить в Telegram
            </Button>
            <Button
              variant="outline"
              className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
              onClick={p.sendWhatsapp}
            >
              <Icon name="MessageCircle" size={18} className="mr-2" /> Отправить в WhatsApp
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}