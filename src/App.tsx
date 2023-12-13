import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import PlayerPage from './pages/PlayerPage';
import MaintainerPage from './pages/MaintainerPage';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/player" />} />
        <Route path="/player" Component={PlayerPage} />
        <Route path="/maintainer" Component={MaintainerPage} />
      </Routes>
    </MainLayout>
  );
}

export default App;
