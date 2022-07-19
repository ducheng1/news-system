import './App.css';
import IndexRouter from "./router/indexRouter";
import {Provider} from "react-redux";
import 'antd/dist/antd.css';
import {persistedStore, store} from "./redux/store";
import {PersistGate} from "redux-persist/integration/react";

function App() {
    return <Provider store={store}>
        <PersistGate loading={null} persistor={persistedStore}>
            <IndexRouter/>
        </PersistGate>
    </Provider>
}

export default App;