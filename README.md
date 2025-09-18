# Reserve Já - Turismo & Hotelaria

- npm install
- npm prepare
- npx prisma migrate deploy

## Plataforma de Reservas com Precificação Dinâmica

Referência: Airbnb, Booking.com
Objetivo: Usuários reservam estadias /experiências, pagamento ocorre no ato e os valores ficam bloqueados até o check-in. O sistema ajusta preços dinamicamente (ex.: alta temporada, alta procura).

## Propósito do Projeto

Tornar reservas mais inteligentes (preços dinâmicos, disponibilidade em tempo real).

Garantir segurança financeira (pagamento bloqueado até o check-in, split entre anfitrião/plataforma).

Oferecer recomendações personalizadas para usuários (hóspedes encontram melhores opções rapidamente, anfitriões têm insights para precificação).

## Requisitos Funcionais

- [x] Cadastro de usuários: viajante, anfitrião, admin.
- [x] Autenticar Usuário
- [x] Cadastro de propriedades: fotos, descrição, localização, regras da casa.
- [ ] Busca e filtros: localização, preço, comodidades, datas disponíveis.
- [ ] Reserva online: pagamento feito no ato (PIX/cartão simulado), valor bloqueado até check-in.
- [ ] Política de cancelamento: reembolso total/parcial conforme regra do anfitrião.
- [ ] Reputação: avaliação mútua (anfitrião ↔ hóspede).
- [ ] Precificação dinâmica:
  
  *Ajuste de preço baseado em fatores como:*
    - [ ] Ocupação do mês (% de datas já reservadas).
    - [ ] Distância da data da reserva (última hora ou reserva antecipada).
    - [ ] Temporada (alta vs baixa).

## Requisitos Não Funcionais

- [ ] Segurança: criptografar dados sensíveis, autenticação JWT + refresh tokens.
- [ ] Escalabilidade: sistema preparado para muitas reservas simultâneas.
- [ ] Disponibilidade: 99% uptime (simulado).
- [ ] Auditoria: todas as transações financeiras devem ser rastreáveis.

## Regras de Negócio

- [ ] O pagamento é feito no ato da reserva → mas só liberado ao anfitrião após check-in confirmado.
- [ ] A plataforma retém taxa fixa (ex: 10%) de cada reserva.
- [ ] Cancelamento segue política definida pelo anfitrião (ex.: até 7 dias antes → reembolso total).
- [ ] Usuário só pode avaliar anfitrião após estadia concluída.
- [ ] Reservas suspeitas podem ser bloqueadas pelo admin.
- [ ] Se anfitrião cancelar várias vezes, é penalizado.


- Comece com o esqueleto (auth, cadastro, reserva fake).
- Depois coloque pagamento (api de pagamento para testes) + regras de negócio críticas (bloqueio, cancelamento).

- Só então vá para diferenciais de IA e precificação dinâmica.
- Finalize com dashboards, notificações e extras que enriquecem a experiência.