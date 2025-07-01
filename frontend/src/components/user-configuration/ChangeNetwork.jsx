import { useState } from 'react';
import '../../../public/styles/pop-up/PopupConfiguration.css';

const networkNameMap = {
  'pennarroya': 'Peñarroya',
  'argamasilla': 'Argamasilla de Alba',
};

const ChangeNetwork = ({ popupData, fadeMixinNotTime, onNetworkChange }) => {
    const networks = popupData?.networks || [];
    const defaultNetwork = popupData?.ddbbSelected || '';
    const [selectedOption, setSelectedOption] = useState(defaultNetwork);

    const handleNetworkChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            let saveLocationOptionResult = await fetch(
                `/api/save-location-option`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ selectedOption }),
                }
            );

            if (!saveLocationOptionResult.ok) {
                throw new Error('Network selection failed');
            }
            
            const response = await saveLocationOptionResult.json();
            // Show success message using fadeMixinNotTime
            fadeMixinNotTime.fire({
                icon: 'success',
                title: 'Red cambiada',
                text: 'La red ha sido cambiada'
            });
            onNetworkChange();
        } catch (error) {
            console.error('Error changing network:', error);
            // Show error message
            fadeMixinNotTime.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to change network. Please try again.'
            });
        }
    };

    // Function to get display name for network
    const getNetworkDisplayName = (network) => {
        return networkNameMap[network] || network; // Fallback to original name if no mapping exists
    };

    return (
        <div className="tab_content_popup_configuration">
            <div
                id="container-submit-network-selection"
                className="container_submit_password"
                style={{ flexDirection: 'column' }}
            >
                <div
                    className="network-selector-container"
                    style={{
                        width: '95%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    {networks.map((network, index) => (
                        <div className="inputGroup" key={`radio${index}`}>
                            <input
                                value={network}
                                id={`radio${index}`}
                                name="radio"
                                type="radio"
                                checked={network === selectedOption}
                                onChange={handleNetworkChange}
                            />
                            <label htmlFor={`radio${index}`}>
                                {getNetworkDisplayName(network)}
                            </label>
                        </div>
                    ))}
                </div>

                <button
                    id="button-submit-network-selection"
                    className="button_common"
                    type="button"
                    onClick={handleSubmit}
                >
                </button>
            </div>
        </div>
    );
};

export default ChangeNetwork;