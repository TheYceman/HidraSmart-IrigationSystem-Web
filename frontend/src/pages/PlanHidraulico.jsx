import React, { useState, useEffect, Suspense, lazy } from "react";
import '../../public/styles/plan-hidraulico/plan-hidraulico-analysis.css';
import '../../public/styles/plan-hidraulico/plan-hidraulico-condition.css';
import '../../public/styles/container-legend.css';
import '../../public/styles/pop-up/PopupConfiguration.css';
import GoogleApiKeyProvider from "../components/api-keys/GoogleApiKeyProvider";
import { fetchUserData } from '../../public/scripts/fetch-user-data.js';

function PlanHidraulico() {
    const [activeTab, setActiveTab] = React.useState('layer-tab');
    const [userData, setUserData] = useState(null);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    const togglePopup = () => {
        const overlay = document.getElementById('popupOverlay');
        overlay.classList.toggle('hidden');
    };
    const dataVerification = "../../scripts/data-verification.js";

    useEffect(() => {
        const scriptUrls = [
            "/scripts/plan-hidraulico/network-manager-analysis.js",
            "/scripts/plan-hidraulico/network-manager-condition.js",
        ];

        const loadScript = (src) =>
            new Promise((resolve, reject) => {
                const existingScript = Array.from(document.scripts).find((s) => s.src.includes(src));
                if (existingScript) {
                    resolve();
                    return;
                }

                const script = document.createElement("script");
                script.src = src;
                script.defer = true;
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            });

        const loadAllScripts = async () => {
            for (const src of scriptUrls) {
                try {
                    await loadScript(src);
                } catch (err) {
                    console.error("Error cargando script:", src, err);
                }
            }
        };

        const loadUserData = async () => {
            try {
                const data = await fetchUserData();
                // Almacenar userData en window para que sea accesible globalmente (provisional hasta que se haya creado el contexto global)
                window.userData = data;
                setUserData(data);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        loadAllScripts();
        loadUserData();

        return () => {
            // scriptUrls.forEach((src) => {
            //     const script = Array.from(document.scripts).find((s) => s.src.includes(src));
            //     if (script) {
            //         document.body.removeChild(script);
            //     }
            // });
        };
    }, []);


    return (
        <div className="container_data_viewer" id="container-data-viewer">
            <div className="slideCol_map">
                <div className="scroller_map">
                    <div id="inner-element-map" className="inner_map">
                        <div className="container_map_condition">
                            <div id="body-map-condition" className="body_map_condition">
                                <div className="container_legend subcontainers_up" id="container-legend">
                                    <div id="tab-list" className="tab_list" role="tablist">
                                        <label id="label-layer-tab" className="label_tab">
                                            <i className="fas_tab fas fa-layer-group"></i>
                                            Capas
                                            <input
                                                name="tablist"
                                                type="radio"
                                                checked={activeTab === 'layer-tab'}
                                                onChange={() => handleTabChange('layer-tab')}
                                            />
                                        </label>
                                        <div
                                            id="layer-tab"
                                            className={`layer_tab_network div_tab legend_tab_start custom_scrollbar ${activeTab === 'layer-tab' ? 'block' : 'hidden'}`}
                                            role="tabpanel"
                                        >
                                            {/* Layer content can be added here */}
                                        </div>
                                        <label id="label-legend-tab" className="label_tab" role="tab">
                                            <i className="fas_tab fas fa-map-marked-alt"></i>
                                            Leyenda
                                            <input
                                                name="tablist"
                                                type="radio"
                                                checked={activeTab === 'legend-tab'}
                                                onChange={() => handleTabChange('legend-tab')}
                                            />
                                        </label>
                                        <div
                                            id="legend-tab"
                                            className={`legend_tab legend_tab_start div_tab custom_scrollbar ${activeTab === 'legend-tab' ? 'block' : 'hidden'}`}
                                            role="tabpanel"
                                        >
                                            <div className="legend-item">
                                                <div className="legend-title">Depósitos</div>
                                                <div className="legend-item-field">
                                                    <strong>Energía (m.c.a.)</strong>
                                                    <div className="body_conductions_legend">
                                                        <div className="type_1_conductions_legend range_conductions_legend">
                                                            <div className="type_1_conductions_material_legend_icon" style={{ backgroundColor: 'blue' }}></div>
                                                            <p>≥ 677.45 - &lt; 683.33</p>
                                                        </div>
                                                        <div className="type_2_conductions_legend range_conductions_legend">
                                                            <div className="type_2_conductions_material_legend_icon" style={{ backgroundColor: 'green' }}></div>
                                                            <p>≥ 683.33 - &lt; 683.43</p>
                                                        </div>
                                                        <div className="type_3_conductions_legend range_conductions_legend">
                                                            <div className="type_3_conductions_material_legend_icon" style={{ backgroundColor: 'yellow' }}></div>
                                                            <p>≥ 683.43 - &lt; 683.61</p>
                                                        </div>
                                                        <div className="type_4_conductions_legend range_conductions_legend">
                                                            <div className="type_4_conductions_material_legend_icon" style={{ backgroundColor: 'orange' }}></div>
                                                            <p>≥ 683.61 - &lt; 683.73</p>
                                                        </div>
                                                        <div className="type_5_conductions_legend range_conductions_legend">
                                                            <div className="type_5_conductions_material_legend_icon" style={{ backgroundColor: 'maroon' }}></div>
                                                            <p>≥ 683.73 - ≤ 684.39</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="legend-item-field">
                                                    <strong>Presión (m.c.a.)</strong>
                                                    <div className="body_conductions_legend">
                                                        <div className="type_1_conductions_legend range_conductions_legend">
                                                            <div className="type_1_conductions_material_legend_icon" style={{ backgroundColor: 'blue' }}></div>
                                                            <p>≥ -9.33 - &lt; 0</p>
                                                        </div>
                                                        <div className="type_2_conductions_legend range_conductions_legend">
                                                            39
                                                            <div className="type_2_conductions_material_legend_icon" style={{ backgroundColor: 'green' }}></div>
                                                            <p>≥ 0 - &lt; 36.49</p>
                                                        </div>
                                                        <div className="type_3_conductions_legend range_conductions_legend">
                                                            <div className="type_3_conductions_material_legend_icon" style={{ backgroundColor: 'yellow' }}></div>
                                                            <p>≥ 36.49 - &lt; 40.67</p>
                                                        </div>
                                                        <div className="type_4_conductions_legend range_conductions_legend">
                                                            <div className="type_4_conductions_material_legend_icon" style={{ backgroundColor: 'orange' }}></div>
                                                            <p>≥ 40.67 - &lt; 43.56</p>
                                                        </div>
                                                        <div className="type_5_conductions_legend range_conductions_legend">
                                                            <div className="type_5_conductions_material_legend_icon" style={{ backgroundColor: 'maroon' }}></div>
                                                            <p>≥ 43.56 - ≤ 51.41</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="legend-item-field">
                                                    <strong>Consumo (L/s)</strong>
                                                    <div className="body_conductions_legend">
                                                        <div className="type_1_conductions_legend range_conductions_legend">
                                                            <div className="type_1_conductions_material_legend_icon" style={{ backgroundColor: 'blue' }}></div>
                                                            <p>= 0</p>
                                                        </div>
                                                        <div className="type_2_conductions_legend range_conductions_legend">
                                                            <div className="type_2_conductions_material_legend_icon" style={{ backgroundColor: 'green' }}></div>
                                                            <p>&gt; 0 - &lt; 0.0024</p>
                                                        </div>
                                                        <div className="type_3_conductions_legend range_conductions_legend">
                                                            <div className="type_3_conductions_material_legend_icon" style={{ backgroundColor: 'yellow' }}></div>
                                                            <p>≥ 0.0024 - &lt; 0.0047</p>
                                                        </div>
                                                        <div className="type_4_conductions_legend range_conductions_legend">
                                                            <div className="type_4_conductions_material_legend_icon" style={{ backgroundColor: 'orange' }}></div>
                                                            <p>≥ 0.0047 - &lt; 0.0076</p>
                                                        </div>
                                                        <div className="type_5_conductions_legend range_conductions_legend">
                                                            <div className="type_5_conductions_material_legend_icon" style={{ backgroundColor: 'maroon' }}></div>
                                                            <p>≥ 0.0076</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="legend-item-field">
                                                    <strong>Edad del agua (h)</strong>
                                                    <div className="body_conductions_legend">
                                                        <div className="type_1_conductions_legend range_conductions_legend">
                                                            <div className="type_1_conductions_material_legend_icon" style={{ backgroundColor: 'blue' }}></div>
                                                            <p>≥ 0 - &lt; 3</p>
                                                        </div>
                                                        <div className="type_2_conductions_legend range_conductions_legend">
                                                            <div className="type_2_conductions_material_legend_icon" style={{ backgroundColor: 'green' }}></div>
                                                            <p>≥ 3 - &lt; 24</p>
                                                        </div>
                                                        <div className="type_3_conductions_legend range_conductions_legend">
                                                            <div className="type_3_conductions_material_legend_icon" style={{ backgroundColor: 'yellow' }}></div>
                                                            <p>≥ 24 - &lt; 48</p>
                                                        </div>
                                                        <div className="type_4_conductions_legend range_conductions_legend">
                                                            <div className="type_4_conductions_material_legend_icon" style={{ backgroundColor: 'orange' }}></div>
                                                            <p>≥ 48 - &lt; 72</p>
                                                        </div>
                                                        <div className="type_5_conductions_legend range_conductions_legend">
                                                            <div className="type_5_conductions_material_legend_icon" style={{ backgroundColor: 'maroon' }}></div>
                                                            <p>≥ 72</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="legend-item">
                                                <div className="legend-title">Nodos</div>
                                                <div className="legend-item-field">
                                                    <strong>Purgas</strong>
                                                    <div className="body_conductions_legend">Sin datos</div>
                                                </div>
                                                <div className="legend-item-field">
                                                    <strong>Energía (m.c.a.)</strong>
                                                    <div className="body_conductions_legend">
                                                        <div className="type_1_conductions_legend range_conductions_legend">
                                                            <div className="type_1_conductions_material_legend_icon" style={{ backgroundColor: 'blue' }}></div>
                                                            <p>≥ 677.45 - &lt; 683.33</p>
                                                        </div>
                                                        <div className="type_2_conductions_legend range_conductions_legend">
                                                            <div className="type_2_conductions_material_legend_icon" style={{ backgroundColor: 'green' }}></div>
                                                            <p>≥ 683.33 - &lt; 683.43</p>
                                                        </div>
                                                        <div className="type_3_conductions_legend range_conductions_legend">
                                                            <div className="type.bing_color: yellow;"></div>
                                                            <p>≥ 683.43 - &lt; 683.61</p>
                                                        </div>
                                                        <div className="type_4_conductions_legend range_conductions_legend">
                                                            <div className="type_4_conductions_material_legend_icon" style={{ backgroundColor: 'orange' }}></div>
                                                            <p>≥ 683.61 - &lt; 683.73</p>
                                                        </div>
                                                        <div className="type_5_conductions_legend range_conductions_legend">
                                                            <div className="type_5_conductions_material_legend_icon" style={{ backgroundColor: 'maroon' }}></div>
                                                            <p>≥ 683.73 - ≤ 684.39</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="legend-item-field">
                                                    <strong>Presión (m.c.a.)</strong>
                                                    <div className="body_conductions_legend">
                                                        <div className="type_1_conductions_legend range_conductions_legend">
                                                            <div className="type_1_conductions_material_legend_icon" style={{ backgroundColor: 'blue' }}></div>
                                                            <p>≥ -9.33 - &lt; 0</p>
                                                        </div>
                                                        <div className="type_2_conductions_legend range_conductions_legend">
                                                            <div className="type_2_conductions_material_legend_icon" style={{ backgroundColor: 'green' }}></div>
                                                            <p>≥ 0 - &lt; 36.49</p>
                                                        </div>
                                                        <div className="type_3_conductions_legend range_conductions_legend">
                                                            <div className="type_3_conductions_material_legend_icon" style={{ backgroundColor: 'yellow' }}></div>
                                                            <p>≥ 36.49 - &lt; 40.67</p>
                                                        </div>
                                                        <div className="type_4_conductions_legend range_conductions_legend">
                                                            <div className="type_4_conductions_material_legend_icon" style={{ backgroundColor: 'orange' }}></div>
                                                            <p>≥ 40.67 - &lt; 43.56</p>
                                                        </div>
                                                        <div className="type_5_conductions_legend range_conductions_legend">
                                                            <div className="type_5_conductions_material_legend_icon" style={{ backgroundColor: 'maroon' }}></div>
                                                            <p>≥ 43.56 - ≤ 51.41</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="legend-item-field">
                                                    <strong>Edad del agua (h)</strong>
                                                    <div className="body_conductions_legend">
                                                        <div className="type_1_conductions_legend range_conductions_legend">
                                                            <div className="type_1_conductions_material_legend_icon" style={{ backgroundColor: 'blue' }}></div>
                                                            <p>≥ 0 - &lt; 3</p>
                                                        </div>
                                                        <div className="type_2_conductions_legend range_conductions_legend">
                                                            <div className="type_2_conductions_material_legend_icon" style={{ backgroundColor: 'green' }}></div>
                                                            <p>≥ 3 - &lt; 24</p>
                                                        </div>
                                                        <div className="type_3_conductions_legend range_conductions_legend">
                                                            <div className="type_3_conductions_material_legend_icon" style={{ backgroundColor: 'yellow' }}></div>
                                                            <p>≥ 24 - &lt; 48</p>
                                                        </div>
                                                        <div className="type_4_conductions_legend range_conductions_legend">
                                                            <div className="type_4_conductions_material_legend_icon" style={{ backgroundColor: 'orange' }}></div>
                                                            <p>≥ 48 - &lt; 72</p>
                                                        </div>
                                                        <div className="type_5_conductions_legend range_conductions_legend">
                                                            <div className="type_5_conductions_material_legend_icon" style={{ backgroundColor: 'maroon' }}></div>
                                                            <p>≥ 72</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="legend-item">
                                                <div className="legend-title">Conducciones</div>
                                                <div className="legend-item-field">
                                                    <strong>Dirección del flujo</strong>
                                                </div>
                                                <div className="legend-item-field">
                                                    <strong>Caudal (L/s)</strong>
                                                    <div className="body_conductions_legend">
                                                        <div className="type_1_conductions_legend range_conductions_legend">
                                                            <div className="type_1_conductions_material_legend_icon" style={{ backgroundColor: 'blue' }}></div>
                                                            <p>≥ 0 - &lt; 0.0254</p>
                                                        </div>
                                                        <div className="type_2_conductions_legend range_conductions_legend">
                                                            <div className="type_2_conductions_material_legend_icon" style={{ backgroundColor: 'green' }}></div>
                                                            <p>≥ 0.0254 - &lt; 0.1127</p>
                                                        </div>
                                                        <div className="type_3_conductions_legend range_conductions_legend">
                                                            <div className="type_3_conductions_material_legend_icon" style={{ backgroundColor: 'yellow' }}></div>
                                                            <p>≥ 0.1127 - &lt; 0.3135</p>
                                                        </div>
                                                        <div className="type_4_conductions_legend range_conductions_legend">
                                                            <div className="type_4_conductions_material_legend_icon" style={{ backgroundColor: 'orange' }}></div>
                                                            <p>≥ 0.3135 - &lt; 0.842</p>
                                                        </div>
                                                        <div className="type_5_conductions_legend range_conductions_legend">
                                                            <div className="type_5_conductions_material_legend_icon" style={{ backgroundColor: 'maroon' }}></div>
                                                            <p>≥ 0.842 - ≤ 148.7718</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="legend-item-field">
                                                    <strong>Velocidad (m/s)</strong>
                                                    <div className="body_conductions_legend">
                                                        <div className="type_1_conductions_legend range_conductions_legend">
                                                            <div className="type_1_conductions_material_legend_icon" style={{ backgroundColor: 'blue' }}></div>
                                                            <p>≥ 0 - &lt; 0.018</p>
                                                        </div>
                                                        <div className="type_2_conductions_legend range_conductions_legend">
                                                            <div className="type_2_conductions_material_legend_icon" style={{ backgroundColor: 'green' }}></div>
                                                            <p>≥ 0.018 - &lt; 0.067</p>
                                                        </div>
                                                        <div className="type_3_conductions_legend range_conductions_legend">
                                                            <div className="type_3_conductions_material_legend_icon" style={{ backgroundColor: 'yellow' }}></div>
                                                            <p>≥ 0.067 - &lt; 1</p>
                                                        </div>
                                                        <div className="type_4_conductions_legend range_conductions_legend">
                                                            <div className="type_4_conductions_material_legend_icon" style={{ backgroundColor: 'orange' }}></div>
                                                            <p>≥ 1 - &lt; 2</p>
                                                        </div>
                                                        <div className="type_5_conductions_legend range_conductions_legend">
                                                            <div className="type_5_conductions_material_legend_icon" style={{ backgroundColor: 'maroon' }}></div>
                                                            <p>≥ 2 - ≤ 2.446</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="legend-item-field">
                                                    <strong>Edad del agua (h)</strong>
                                                    <div className="body_conductions_legend">
                                                        <div className="type_1_conductions_legend range_conductions_legend">
                                                            <div className="type_1_conductions_material_legend_icon" style={{ backgroundColor: 'blue' }}></div>
                                                            <p>≥ 0 - &lt; 3</p>
                                                        </div>
                                                        <div className="type_2_conductions_legend range_conductions_legend">
                                                            <div className="type_2_conductions_material_legend_icon" style={{ backgroundColor: 'green' }}></div>
                                                            <p>≥ 3 - &lt; 24</p>
                                                        </div>
                                                        <div className="type_3_conductions_legend range_conductions_legend">
                                                            <div className="type_3_conductions_material_legend_icon" style={{ backgroundColor: 'yellow' }}></div>
                                                            <p>≥ 24 - &lt; 48</p>
                                                        </div>
                                                        <div className="type_4_conductions_legend range_conductions_legend">
                                                            <div className="type_4_conductions_material_legend_icon" style={{ backgroundColor: 'orange' }}></div>
                                                            <p>≥ 48 - &lt; 72</p>
                                                        </div>
                                                        <div className="type_5_conductions_legend range_conductions_legend">
                                                            <div className="type_5_conductions_material_legend_icon" style={{ backgroundColor: 'maroon' }}></div>
                                                            <p>≥ 72</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="legend-item">
                                                <div className="legend-title">Válvulas</div>
                                                <div className="legend-item-field">
                                                    <strong>Posición</strong>
                                                    <div className="body_conductions_legend">
                                                        <div className="type_open_conductions_legend range_conductions_legend">
                                                            <div className="type_open_conductions_material_legend_icon" style={{ backgroundColor: 'green' }}></div>
                                                            <p>Abierta</p>
                                                        </div>
                                                        <div className="type_close_conductions_legend range_conductions_legend">
                                                            <div className="type_close_conductions_material_legend_icon" style={{ backgroundColor: 'red' }}></div>
                                                            <p>Cerrada</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="legend-item-field">
                                                    <strong>Caudal (L/s)</strong>
                                                    <div className="body_conductions_legend">
                                                        <div className="type_1_conductions_legend range_conductions_legend">
                                                            <div className="type_1_conductions_material_legend_icon" style={{ backgroundColor: 'blue' }}></div>
                                                            <p>≥ 0 - &lt; 0.0254</p>
                                                        </div>
                                                        <div className="type_2_conductions_legend range_conductions_legend">
                                                            <div className="type_2_conductions_material_legend_icon" style={{ backgroundColor: 'green' }}></div>
                                                            <p>≥ 0.0254 - &lt; 0.1127</p>
                                                        </div>
                                                        <div className="type_3_conductions_legend range_conductions_legend">
                                                            <div className="type_3_conductions_material_legend_icon" style={{ backgroundColor: 'yellow' }}></div>
                                                            <p>≥ 0.1127 - &lt; 0.3135</p>
                                                        </div>
                                                        <div className="type_4_conductions_legend range_conductions_legend">
                                                            <div className="type_4_conductions_material_legend_icon" style={{ backgroundColor: 'orange' }}></div>
                                                            <p>≥ 0.3135 - &lt; 0.842</p>
                                                        </div>
                                                        <div className="type_5_conductions_legend range_conductions_legend">
                                                            <div className="type_5_conductions_material_legend_icon" style={{ backgroundColor: 'maroon' }}></div>
                                                            <p>≥ 0.842 - ≤ 148.7718</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="legend-item-field">
                                                    <strong>Velocidad (m/s)</strong>
                                                    <div className="body_conductions_legend">
                                                        <div className="type_1_conductions_legend range_conductions_legend">
                                                            <div className="type_1_conductions_material_legend_icon" style={{ backgroundColor: 'blue' }}></div>
                                                            <p>≥ 0 - &lt; 0.018</p>
                                                        </div>
                                                        <div className="type_2_conductions_legend range_conductions_legend">
                                                            <div className="type_2_conductions_material_legend_icon" style={{ backgroundColor: 'green' }}></div>
                                                            <p>≥ 0.018 - &lt; 0.067</p>
                                                        </div>
                                                        <div className="type_3_conductions_legend range_conductions_legend">
                                                            <div className="type_3_conductions_material_legend_icon" style={{ backgroundColor: 'yellow' }}></div>
                                                            <p>≥ 0.067 - &lt; 1</p>
                                                        </div>
                                                        <div className="type_4_conductions_legend range_conductions_legend">
                                                            <div className="type_4_conductions_material_legend_icon" style={{ backgroundColor: 'orange' }}></div>
                                                            <p>≥ 1 - &lt; 2</p>
                                                        </div>
                                                        <div className="type_5_conductions_legend range_conductions_legend">
                                                            <div className="type_5_conductions_material_legend_icon" style={{ backgroundColor: 'maroon' }}></div>
                                                            <p>≥ 2 - ≤ 2.446</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="legend-item-field">
                                                    <strong>Edad del agua (h)</strong>
                                                    <div className="body_conductions_legend">
                                                        <div className="type_1_conductions_legend range_conductions_legend">
                                                            <div className="type_1_conductions_material_legend_icon" style={{ backgroundColor: 'blue' }}></div>
                                                            <p>≥ 0 - &lt; 3</p>
                                                        </div>
                                                        <div className="type_2_conductions_legend range_conductions_legend">
                                                            <div className="type_2_conductions_material_legend_icon" style={{ backgroundColor: 'green' }}></div>
                                                            <p>≥ 3 - &lt; 24</p>
                                                        </div>
                                                        <div className="type_3_conductions_legend range_conductions_legend">
                                                            <div className="type_3_conductions_material_legend_icon" style={{ backgroundColor: 'yellow' }}></div>
                                                            <p>≥ 24 - &lt; 48</p>
                                                        </div>
                                                        <div className="type_4_conductions_legend range_conductions_legend">
                                                            <div className="type_4_conductions_material_legend_icon" style={{ backgroundColor: 'orange' }}></div>
                                                            <p>≥ 48 - &lt; 72</p>
                                                        </div>
                                                        <div className="type_5_conductions_legend range_conductions_legend">
                                                            <div className="type_5_conductions_material_legend_icon" style={{ backgroundColor: 'maroon' }}></div>
                                                            <p>≥ 72</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="legend-item">
                                                <div className="legend-title">Parcelas</div>
                                                <div className="legend-item-field">
                                                    <strong>Energía (m.c.a.)</strong>
                                                    <div className="body_conductions_legend">
                                                        <div className="type_1_conductions_legend range_conductions_legend">
                                                            <div className="type_1_conductions_material_legend_icon" style={{ backgroundColor: 'blue' }}></div>
                                                            <p>≥ 677.45 - &lt; 683.33</p>
                                                        </div>
                                                        <div className="type_2_conductions_legend range_conductions_legend">
                                                            <div className="type_2_conductions_material_legend_icon" style={{ backgroundColor: 'green' }}></div>
                                                            <p>≥ 683.33 - &lt; 683.43</p>
                                                        </div>
                                                        <div className="type_3_conductions_legend range_conductions_legend">
                                                            <div className="type_3_conductions_material_legend_icon" style={{ backgroundColor: 'yellow' }}></div>
                                                            <p>≥ 683.43 - &lt; 683.61</p>
                                                        </div>
                                                        <div className="type_4_conductions_legend range_conductions_legend">
                                                            <div className="type_4_conductions_material_legend_icon" style={{ backgroundColor: 'orange' }}></div>
                                                            <p>≥ 683.61 - &lt; 683.73</p>
                                                        </div>
                                                        <div className="type_5_conductions_legend range_conductions_legend">
                                                            <div className="type_5_conductions_material_legend_icon" style={{ backgroundColor: 'maroon' }}></div>
                                                            <p>≥ 683.73 - ≤ 684.39</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="legend-item-field">
                                                    <strong>Presión (m.c.a.)</strong>
                                                    <div className="body_conductions_legend">
                                                        <div className="type_1_conductions_legend range_conductions_legend">
                                                            <div className="type_1_conductions_material_legend_icon" style={{ backgroundColor: 'blue' }}></div>
                                                            <p>≥ -9.33 - &lt; 0</p>
                                                        </div>
                                                        <div className="type_2_conductions_legend range_conductions_legend">
                                                            <div className="type_2_conductions_material_legend_icon" style={{ backgroundColor: 'green' }}></div>
                                                            <p>≥ 0 - &lt; 36.49</p>
                                                        </div>
                                                        <div className="type_3_conductions_legend range_conductions_legend">
                                                            <div className="type_3_conductions_material_legend_icon" style={{ backgroundColor: 'yellow' }}></div>
                                                            <p>≥ 36.49 - &lt; 40.67</p>
                                                        </div>
                                                        <div className="type_4_conductions_legend range_conductions_legend">
                                                            <div className="type_4_conductions_material_legend_icon" style={{ backgroundColor: 'orange' }}></div>
                                                            <p>≥ 40.67 - &lt; 43.56</p>
                                                        </div>
                                                        <div className="type_5_conductions_legend range_conductions_legend">
                                                            <div className="type_5_conductions_material_legend_icon" style={{ backgroundColor: 'maroon' }}></div>
                                                            <p>≥ 43.56 - ≤ 51.41</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="legend-item-field">
                                                    <strong>Consumo (L/s)</strong>
                                                    <div className="body_conductions_legend">
                                                        <div className="type_1_conductions_legend range_conductions_legend">
                                                            <div className="type_1_conductions_material_legend_icon" style={{ backgroundColor: 'blue' }}></div>
                                                            <p>= 0</p>
                                                        </div>
                                                        <div className="type_2_conductions_legend range_conductions_legend">
                                                            <div className="type_2_conductions_material_legend_icon" style={{ backgroundColor: 'green' }}></div>
                                                            <p>&gt; 0 - &lt; 0.0024</p>
                                                        </div>
                                                        <div className="type_3_conductions_legend range_conductions_legend">
                                                            <div className="type_3_conductions_material_legend_icon" style={{ backgroundColor: 'yellow' }}></div>
                                                            <p>≥ 0.0024 - &lt; 0.0047</p>
                                                        </div>
                                                        <div className="type_4_conductions_legend range_conductions_legend">
                                                            <div className="type_4_conductions_material_legend_icon" style={{ backgroundColor: 'orange' }}></div>
                                                            <p>≥ 0.0047 - &lt; 0.0076</p>
                                                        </div>
                                                        <div className="type_5_conductions_legend range_conductions_legend">
                                                            <div className="type_5_conductions_material_legend_icon" style={{ backgroundColor: 'maroon' }}></div>
                                                            <p>≥ 0.0076</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="legend-item-field">
                                                    <strong>Edad del agua (h)</strong>
                                                    <div className="body_conductions_legend">
                                                        <div className="type_1_conductions_legend range_conductions_legend">
                                                            <div className="type_1_conductions_material_legend_icon" style={{ backgroundColor: 'blue' }}></div>
                                                            <p>≥ 0 - &lt; 3</p>
                                                        </div>
                                                        <div className="type_2_conductions_legend range_conductions_legend">
                                                            <div className="type_2_conductions_material_legend_icon" style={{ backgroundColor: 'green' }}></div>
                                                            <p>≥ 3 - &lt; 24</p>
                                                        </div>
                                                        <div className="type_3_conductions_legend range_conductions_legend">
                                                            <div className="type_3_conductions_material_legend_icon" style={{ backgroundColor: 'yellow' }}></div>
                                                            <p>≥ 24 - &lt; 48</p>
                                                        </div>
                                                        <div className="type_4_conductions_legend range_conductions_legend">
                                                            <div className="type_4_conductions_material_legend_icon" style={{ backgroundColor: 'orange' }}></div>
                                                            <p>≥ 48 - &lt; 72</p>
                                                        </div>
                                                        <div className="type_5_conductions_legend range_conductions_legend">
                                                            <div className="type_5_conductions_material_legend_icon" style={{ backgroundColor: 'maroon' }}></div>
                                                            <p>≥ 72</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <label id="label-export-tab" className="label_tab" role="tab">
                                            <i className="fas_tab fas fa-file-export"></i>
                                            Exportar
                                            <input
                                                name="tablist"
                                                type="radio"
                                                checked={activeTab === 'export-tab'}
                                                onChange={() => handleTabChange('export-tab')}
                                            />
                                        </label>
                                        <div
                                            id="export-tab"
                                            className={`export_tab div_tab ${activeTab === 'export-tab' ? 'block' : 'hidden'}`}
                                            role="tabpanel"
                                        >
                                            <p className="export_title">Exportar datos a <strong>EXCEL</strong></p>
                                            <div id="button-export-to-excel" className="button_export_to_excel">
                                                <button className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600">
                                                    Export to Excel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="toggle-tab" id="toggle-tab" onClick={togglePopup}>
                                        <i className="fa-solid fa-chevron-left"></i>
                                    </div>
                                </div>
                                <div className="container_map_condition subcontainers_up" id="container-map-condition"></div>
                            </div>
                            <div id="button-map-condition" className="button_map_condition shift_bar">
                                Análisis de edad del agua y purgas
                            </div>
                        </div>
                        <div className="container_map_analysis">
                            <div id="button-map-analysis" className="button_map_analysis shift_bar">
                                Estado horario
                            </div>
                            <div id="body-map-analysis" className="body_map_analysis">
                                <div className="container_map_analysis subcontainers_up" id="container-map-analysis"></div>
                                <GoogleApiKeyProvider />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="popupOverlay" className="popupOverlay">
                <div id="popup" className="popup">
                    <div id="chartContainer"></div>
                    <div id="tableContainer" className="table_container"></div>
                    <button
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={togglePopup}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PlanHidraulico;
