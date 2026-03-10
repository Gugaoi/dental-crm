// ===== MOCK DATA =====
const DATA = {
  patients: [
    {id:1,name:'Maria José Santos',cpf:'012.345.678-90',dob:'1985-03-15',phone:'(11) 98765-4321',email:'mariajose@email.com',insurance:'Unimed',status:'Em tratamento',avatar:'MJ',color:'#10b981'},
    {id:2,name:'João Carlos Oliveira',cpf:'123.456.789-01',dob:'1978-07-22',phone:'(11) 97654-3210',email:'joao@email.com',insurance:'Particular',status:'Ativo',avatar:'JO',color:'#3b82f6'},
    {id:3,name:'Ana Paula Lima',cpf:'234.567.890-12',dob:'1992-11-05',phone:'(11) 96543-2109',email:'ana@email.com',insurance:'Amil',status:'Ativo',avatar:'AL',color:'#8b5cf6'},
    {id:4,name:'Pedro Henrique Costa',cpf:'345.678.901-23',dob:'1965-04-18',phone:'(11) 95432-1098',email:'pedro@email.com',insurance:'Bradesco Saúde',status:'Inativo',avatar:'PC',color:'#f59e0b'},
    {id:5,name:'Camila Rodrigues',cpf:'456.789.012-34',dob:'2001-09-30',phone:'(11) 94321-0987',email:'camila@email.com',insurance:'Particular',status:'Ativo',avatar:'CR',color:'#ec4899'},
    {id:6,name:'Fernando Torres',cpf:'567.890.123-45',dob:'1973-01-12',phone:'(11) 93210-9876',email:'fernando@email.com',insurance:'SulAmérica',status:'Em tratamento',avatar:'FT',color:'#06b6d4'},
    {id:7,name:'Beatriz Mendes',cpf:'678.901.234-56',dob:'1989-06-25',phone:'(11) 92109-8765',email:'beatriz@email.com',insurance:'Unimed',status:'Ativo',avatar:'BM',color:'#ef4444'},
    {id:8,name:'Rafael Alves',cpf:'789.012.345-67',dob:'1995-12-08',phone:'(11) 91098-7654',email:'rafael@email.com',insurance:'Particular',status:'Ativo',avatar:'RA',color:'#10b981'},
  ],

  leads: [
    {id:1,name:'Luiza Fernanda',phone:'(11) 91111-2222',interest:'Clareamento Dental',source:'Instagram',stage:'novo',value:'R$800',date:'09/03/2026'},
    {id:2,name:'Marcos Vinicius',phone:'(11) 92222-3333',interest:'Aparelho Ortodôntico',source:'Google',stage:'contato',value:'R$3.500',date:'08/03/2026'},
    {id:3,name:'Thaís Cristina',phone:'(11) 93333-4444',interest:'Implante Dentário',source:'Indicação',stage:'consulta',value:'R$4.200',date:'07/03/2026'},
    {id:4,name:'André Luiz',phone:'(11) 94444-5555',interest:'Facetas de Porcelana',source:'Site',stage:'ganho',value:'R$6.000',date:'06/03/2026'},
    {id:5,name:'Priscila Moura',phone:'(11) 95555-6666',interest:'Limpeza + Avaliação',source:'WhatsApp',stage:'novo',value:'R$200',date:'09/03/2026'},
    {id:6,name:'Gabriel Santos',phone:'(11) 96666-7777',interest:'Clareamento',source:'Instagram',stage:'contato',value:'R$800',date:'08/03/2026'},
    {id:7,name:'Carolina Faria',phone:'(11) 97777-8888',interest:'Prótese Total',source:'Indicação',stage:'perdido',value:'R$2.800',date:'05/03/2026'},
    {id:8,name:'Diego Marques',phone:'(11) 98888-9999',interest:'Restauração',source:'Google',stage:'consulta',value:'R$450',date:'07/03/2026'},
  ],

  appointments: [
    {id:1,patientId:1,patient:'Maria José Santos',doctor:'Dr. Roberto Silva',proc:'Endodontia',date:'2026-03-10',time:'09:00',color:'#3b82f6'},
    {id:2,patientId:2,patient:'João Carlos Oliveira',doctor:'Dra. Ana Pereira',proc:'Limpeza / Profilaxia',date:'2026-03-10',time:'10:00',color:'#10b981'},
    {id:3,patientId:3,patient:'Ana Paula Lima',doctor:'Dr. Carlos Mendes',proc:'Ortodontia',date:'2026-03-11',time:'14:00',color:'#8b5cf6'},
    {id:4,patientId:5,patient:'Camila Rodrigues',doctor:'Dr. Roberto Silva',proc:'Clareamento',date:'2026-03-12',time:'15:30',color:'#f59e0b'},
    {id:5,patientId:6,patient:'Fernando Torres',doctor:'Dra. Ana Pereira',proc:'Implante',date:'2026-03-13',time:'08:30',color:'#ef4444'},
    {id:6,patientId:7,patient:'Beatriz Mendes',doctor:'Dr. Roberto Silva',proc:'Consulta de Avaliação',date:'2026-03-14',time:'11:00',color:'#06b6d4'},
    {id:7,patientId:8,patient:'Rafael Alves',doctor:'Dr. Carlos Mendes',proc:'Restauração',date:'2026-03-17',time:'09:30',color:'#ec4899'},
    {id:8,patientId:4,patient:'Pedro Henrique Costa',doctor:'Dr. Roberto Silva',proc:'Prótese',date:'2026-03-18',time:'13:00',color:'#10b981'},
  ],

  staff: [
    {id:1,name:'Dr. Roberto Silva',role:'Dentista Geral',email:'roberto@clinica.com',phone:'(11) 98111-1111',salary:8500,schedule:'Seg–Sex',status:'Ativo',avatar:'RS',color:'#3b82f6'},
    {id:2,name:'Dra. Ana Pereira',role:'Ortodontista',email:'ana@clinica.com',phone:'(11) 98222-2222',salary:9200,schedule:'Seg–Sex',status:'Ativo',avatar:'AP',color:'#8b5cf6'},
    {id:3,name:'Dr. Carlos Mendes',role:'Implantodontista',email:'carlos@clinica.com',phone:'(11) 98333-3333',salary:10500,schedule:'Ter–Sáb',status:'Ativo',avatar:'CM',color:'#10b981'},
    {id:4,name:'Fernanda Costa',role:'Recepcionista',email:'fernanda@clinica.com',phone:'(11) 98444-4444',salary:2800,schedule:'Seg–Sex',status:'Ativo',avatar:'FC',color:'#f59e0b'},
    {id:5,name:'Lucas Almeida',role:'Auxiliar Odontológico',email:'lucas@clinica.com',phone:'(11) 98555-5555',salary:2200,schedule:'Seg–Sex',status:'Ativo',avatar:'LA',color:'#06b6d4'},
    {id:6,name:'Patrícia Ramos',role:'Técnica em Radiologia',email:'patricia@clinica.com',phone:'(11) 98666-6666',salary:3100,schedule:'Seg–Sex',status:'Férias',avatar:'PR',color:'#ec4899'},
  ],

  stock: [
    {id:1,name:'Luvas de Látex (cx 100)',category:'EPI',qty:45,min:20,cost:28.90,supplier:'MedDental'},
    {id:2,name:'Resina Composta A2',category:'Resina / Cimento',qty:8,min:10,cost:185.00,supplier:'Heraeus Kulzer'},
    {id:3,name:'Fio de Sutura 3-0',category:'Material Descartável',qty:3,min:10,cost:42.00,supplier:'Ethicon'},
    {id:4,name:'Amoxicilina 500mg (cx 15)',category:'Medicamento',qty:22,min:5,cost:18.50,supplier:'Farmácia Central'},
    {id:5,name:'Seringa Carpule',category:'Instrumento',qty:60,min:20,cost:3.50,supplier:'MedDental'},
    {id:6,name:'Anestésico Lidocaína 2%',category:'Medicamento',qty:2,min:8,cost:92.00,supplier:'DFL'},
    {id:7,name:'Escova Dental (cx 50)',category:'Material Descartável',qty:80,min:30,cost:145.00,supplier:'OralB'},
    {id:8,name:'Curativo de Demora',category:'Medicamento',qty:5,min:4,cost:68.00,supplier:'Biodinâmica'},
  ],

  stockMovements: [
    {id:1,item:'Luvas de Látex (cx 100)',type:'Entrada',qty:20,date:'08/03/2026',user:'Fernanda Costa'},
    {id:2,item:'Resina Composta A2',type:'Saída',qty:2,date:'07/03/2026',user:'Dr. Roberto Silva'},
    {id:3,item:'Anestésico Lidocaína 2%',type:'Saída',qty:3,date:'06/03/2026',user:'Dra. Ana Pereira'},
    {id:4,item:'Seringa Carpule',type:'Entrada',qty:30,date:'05/03/2026',user:'Fernanda Costa'},
  ],

  payments: [
    {id:1,patient:'Maria José Santos',proc:'Endodontia',value:'R$1.800',date:'09/03/2026',method:'Cartão',status:'Pago'},
    {id:2,patient:'João Carlos Oliveira',proc:'Limpeza',value:'R$300',date:'09/03/2026',method:'PIX',status:'Pago'},
    {id:3,patient:'Ana Paula Lima',proc:'Ortodontia (parcela)',value:'R$450',date:'08/03/2026',method:'Boleto',status:'Pendente'},
    {id:4,patient:'Camila Rodrigues',proc:'Clareamento',value:'R$800',date:'07/03/2026',method:'Cartão',status:'Pago'},
    {id:5,patient:'Fernando Torres',proc:'Implante (sinal)',value:'R$2.100',date:'06/03/2026',method:'Transferência',status:'Pago'},
    {id:6,patient:'Pedro Henrique Costa',proc:'Prótese',value:'R$2.800',date:'05/03/2026',method:'Parcelado',status:'Atrasado'},
  ],

  invoices: [
    {id:'NF-001',patient:'Maria José Santos',value:'R$1.800',date:'09/03/2026',status:'Emitida'},
    {id:'NF-002',patient:'João Carlos Oliveira',value:'R$300',date:'09/03/2026',status:'Emitida'},
    {id:'NF-003',patient:'Camila Rodrigues',value:'R$800',date:'07/03/2026',status:'Emitida'},
    {id:'NF-004',patient:'Fernando Torres',value:'R$2.100',date:'06/03/2026',status:'Cancelada'},
  ],

  tasks: [
    {id:1,text:'Ligar para Luiza Fernanda (lead)',done:false},
    {id:2,text:'Confirmar consultas de amanhã',done:false},
    {id:3,text:'Renovar estoque de Anestésico',done:false},
    {id:4,text:'Enviar proposta para Marcos Vinicius',done:true},
    {id:5,text:'Atualizar prontuário – Fernando Torres',done:false},
  ],

  messages: {
    1: [
      {from:'in',text:'Olá! Gostaria de agendar uma consulta de avaliação.',time:'09:14'},
      {from:'out',text:'Olá, Maria! Claro, temos horários disponíveis ainda esta semana. Prefere manhã ou tarde?',time:'09:16'},
      {from:'in',text:'Prefiro de manhã, se possível.',time:'09:18'},
      {from:'out',text:'Perfeito! Temos disponível terça às 09h ou quarta às 10h. Qual prefere?',time:'09:19'},
    ],
    2: [
      {from:'in',text:'Bom dia! Minha consulta é hoje às 14h, confirmo presença.',time:'08:30'},
      {from:'out',text:'Bom dia, João! Confirmado. Te esperamos à tarde. 😊',time:'08:45'},
    ],
    3: [
      {from:'out',text:'Olá Ana! Passando para lembrar sua consulta amanhã às 10h.',time:'17:00'},
      {from:'in',text:'Obrigada! Vou estar lá.',time:'17:35'},
      {from:'in',text:'Aliás, posso trazer acompanhante?',time:'17:36'},
      {from:'out',text:'Sim, pode! Sem problema algum.',time:'17:40'},
    ],
  },

  templates: [
    {id:1,name:'Lembrete de Consulta',text:'Olá, {{nome}}! 👋 Passamos para lembrar sua consulta amanhã, {{data}} às {{hora}}. Confirme sua presença respondendo SIM. 😊'},
    {id:2,name:'Boas-vindas',text:'Olá, {{nome}}! Bem-vindo(a) à Clínica Sorriso! 🦷 Estamos felizes em ter você conosco. Qualquer dúvida, é só falar!'},
    {id:3,name:'Aniversariante',text:'Feliz Aniversário, {{nome}}! 🎂 A Clínica Sorriso deseja a você um dia muito especial! Como presente, oferecemos 10% de desconto na sua próxima consulta.'},
    {id:4,name:'Pós-Consulta',text:'Olá, {{nome}}! Esperamos que esteja se sentindo bem após sua consulta hoje. Siga as orientações do dentista e qualquer dúvida pode nos chamar! 😊'},
  ],

  campaigns: [
    {id:1,name:'Clareamento – Promoção Março',target:'Todos os pacientes ativos',sent:145,opens:98,status:'Enviada'},
    {id:2,name:'Aniversariantes do Mês',target:'Pacientes com aniversário em Março',sent:12,opens:10,status:'Enviada'},
    {id:3,name:'Reativação – Inativos 6 meses',target:'Pacientes inativos',sent:0,opens:0,status:'Agendada'},
  ],

  revData: [
    {month:'Out',rev:32000,exp:14000},
    {month:'Nov',rev:35500,exp:15200},
    {month:'Dez',rev:29000,exp:13800},
    {month:'Jan',rev:38200,exp:16500},
    {month:'Fev',rev:40100,exp:17000},
    {month:'Mar',rev:42800,exp:18200},
  ],

  suppliers: [
    {id:1,name:'MedDental Distribuidora',contact:'contato@meddental.com.br',phone:'(11) 3000-1234',category:'Material Geral'},
    {id:2,name:'Heraeus Kulzer Brasil',contact:'pedidos@heraeuskulzer.com.br',phone:'(11) 3001-5678',category:'Resinas'},
    {id:3,name:'DFL Indústria',contact:'vendas@dfl.com.br',phone:'(21) 2900-0000',category:'Anestésicos'},
  ],

  users: [
    {name:'Dr. Roberto Silva',email:'roberto@clinica.com',role:'Administrador',status:'Ativo'},
    {name:'Dra. Ana Pereira',email:'ana@clinica.com',role:'Dentista',status:'Ativo'},
    {name:'Dr. Carlos Mendes',email:'carlos@clinica.com',role:'Dentista',status:'Ativo'},
    {name:'Fernanda Costa',email:'fernanda@clinica.com',role:'Recepcionista',status:'Ativo'},
    {name:'Lucas Almeida',email:'lucas@clinica.com',role:'Auxiliar',status:'Ativo'},
  ],
};
