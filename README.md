# 🛸 UFO Abduction 3D Experience

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

> Um portfólio interativo e gamificado em 3D onde você controla um UFO, abduz tecnologias e explora uma fazenda interativa.

---

## 📸 Preview

<div align="center">
  <img src="./public/placeholder.svg" alt="Game Screenshot" width="700" />
</div>

## 📖 Sobre o Projeto

Este projeto é uma experiência imersiva desenvolvida com **React Three Fiber** e **Rapier Physics**. O objetivo foi criar um portfólio criativo onde o usuário explora minhas habilidades técnicas de uma forma divertida.

O cenário é uma fazenda noturna atmosférica, completa com iluminação volumétrica, física realista e interações 3D.

### ✨ Funcionalidades Principais

- **🎮 Controle de UFO com Física**: Sistema de propulsão e inércia realista.
- **🐮 Abdução de Skills**: As vacas representam tecnologias (React, Node, AWS) e podem ser abduzidas.
- **🏗️ Estruturas Interativas**:
  - **Celeiro**: Abre um modal "Sobre Mim" ao entrar.
  - **Antena**: Sistema de "Contato" animado com luzes de sinalização.
  - **Círculos nas Plantações**: Elementos visuais misteriosos.
- **💡 Iluminação & Atmosfera**: Ciclo noturno, neblina (fog), luzes volumétricas e materiais de vidro/metal.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as melhores práticas e ferramentas modernas de desenvolvimento web 3D:

- **Core**: [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **3D Engine**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) (R3F)
- **Helpers**: [Drei](https://github.com/pmndrs/drei) (Câmeras, Controles, Environment)
- **Física**: [React Three Rapier](https://github.com/pmndrs/react-three-rapier)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)

---

## 🎮 Como Jogar / Controles

| Tecla | Ação |
| :---: | :--- |
| **W A S D** | Movimentar o UFO pelo cenário |
| **ESPAÇO** | Ativar raio abdutor (Puxar vacas/objetos) |
| **Mouse** | Interagir com a câmera (Orbit) |

---

## 🚀 Como rodar localmente

Siga os passos abaixo para clonar e executar o projeto na sua máquina.

**Pré-requisitos**: Node.js instalado (Recomendado v18+).

```bash
# 1. Clone o repositório
git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git)

# 2. Entre na pasta do projeto
cd SEU_REPOSITORIO

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev