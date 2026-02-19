# 🛸 Fullstack Invasion 3D (Portfolio Experience)

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

> Um portfólio interativo e gamificado em 3D onde você controla um UFO, abduz tecnologias, explora uma fazenda interativa e compete em um placar global em tempo real.

---

## 📸 Preview

<div align="center">
  <img src="./public/3dgame.png" alt="Game Screenshot" width="700" />
</div>

## 📖 Sobre o Projeto

Este projeto é uma experiência imersiva desenvolvida com **React Three Fiber** e **Rapier Physics**. O objetivo foi criar um portfólio criativo onde o usuário explora minhas habilidades técnicas e projetos reais de uma forma divertida e interativa, unindo frontend 3D avançado com backend Serverless.

O cenário é uma fazenda noturna atmosférica, completa com iluminação volumétrica, física realista, sistema de som integrado e conexão de dados em tempo real.

### ✨ Funcionalidades Principais

- **🎮 Controle de UFO com Física**: Sistema de propulsão e inércia realista.
- **🐮 Abdução de Skills**: As vacas e objetos representam tecnologias e projetos que podem ser abduzidos para completar o jogo.
- **🏆 Placar Global 3D (Leaderboard)**: Um telão eletrônico sci-fi renderizado no mundo 3D que exibe o Top 10 global em tempo real.
- **🌍 Geolocalização Automática**: Identifica o país do jogador via IP ao finalizar a missão para registrar sua bandeira no placar.
- **🛰️ Tela de Loading Imersiva**: Efeitos de scanline, partículas de código e *pre-fetching* de dados do banco antes do jogo começar.
- **🎵 Áudio e Trilha Sonora**: Sistema de som com música de fundo contínua e notificações visuais de "Tocando Agora".
- **🗺️ Mapa Interativo Integrado**: Modal com iframe do Google Maps e recursos de acessibilidade (Text-to-Speech) integrado aos projetos.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as melhores práticas e ferramentas modernas de desenvolvimento web:

- **Core**: [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **3D Engine**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) (R3F)
- **Física**: [React Three Rapier](https://github.com/pmndrs/react-three-rapier)
- **Backend & Realtime**: [Supabase](https://supabase.com/) (PostgreSQL + Realtime WebSockets)
- **Estilização & Animação**: [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **UI Components**: [Lucide React](https://lucide.dev/) (Ícones)

---

## 🎮 Como Jogar / Controles

| Tecla / Ação | Descrição |
| :---: | :--- |
| **W A S D** | Movimentar o UFO pelo cenário |
| **ESPAÇO** | Ativar raio abdutor (Puxar vacas/skills) |
| **Mouse (Arrastar)** | Interagir com a câmera (Orbit Controls) |
| **Ícone 🔊** | Ligar/Desligar a trilha sonora |

---

## 🚀 Como rodar localmente

Siga os passos abaixo para clonar e executar o projeto na sua máquina.

**Pré-requisitos**: Node.js instalado (Recomendado v18+).

### 1. Clone o repositório
```bash
git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git)
cd SEU_REPOSITORIO

# 2. Entre na pasta do projeto
cd SEU_REPOSITORIO

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev