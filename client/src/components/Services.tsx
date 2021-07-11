import React from "react";
import _ from "lodash";
import * as apis from "../apis";
import {
  PromoActivation,
  PromoActivationState,
  Service,
  ServicesComponentAppState,
} from "../types";
import { Loader } from "./Loader";

export class Services extends React.Component {
  state: ServicesComponentAppState = {
    services: [],
    errorMessage: "",
    loading: true,
    activationloading: false,
    promoActivation: null,
    searchTerm: "",
    searchResults: [],
  };

  async componentDidMount() {
    await this.getServicesAndPromotions();
  }

  activatePromotion = async (service: Service, promoCode: string) => {
    this.setState({ errorMessage: "", activationloading: true });

    const response = await apis.services.activateBonus(promoCode);
    if (response.ok && response.data) {
      this.updatePromoActivationState(service, { isActivated: true });
    } else {
      if (!response.ok && response.data && response.data.error) {
        const { error, existingActivePromoActivation } = response.data;

        if (existingActivePromoActivation) {
          this.updatePromoActivationState(service, { isActivated: true });
        } else {
          this.setState({ errorMessage: error });
        }
      } else {
        this.setState({ errorMessage: "Failed to activate promo" });
      }
    }
    this.setState({ activationloading: false });
  };

  copyToClipBoard = async (promoCode: string) => {
    await navigator.clipboard.writeText(promoCode);
    alert(`Copied to clipboard!`);
  };

  getServicesAndPromotions = async () => {
    const response = await apis.services.list();

    if (response && response.ok && response.data) {
      const { services } = response.data;
      this.setState({ services, loading: false });

      const promoActivationState: PromoActivationState = {};

      for (const service of services) {
        promoActivationState[service.id] = {
          isActivated: false,
          codes: service.promoCodes,
          selectedCode: _.sample(service.promoCodes) ?? service.promoCodes[0],
        };
      }
      this.setState({ promoActivation: promoActivationState });
    } else {
      const errorMessage = response.data?.error ?? "Failed to get promotions";
      this.setState({ errorMessage, loading: false });
    }
  };

  getAnotherCode = (service: Service) => {
    const { promoActivation } = this.state;
    if (!promoActivation) {
      return;
    }

    this.updatePromoActivationState(service, {
      selectedCode: _.sample(service.promoCodes) ?? service.promoCodes[0],
      isActivated: false,
    });
  };

  renderServiceCards = () => {
    const {
      services,
      promoActivation,
      searchTerm,
      searchResults,
      activationloading,
    } = this.state;
    const listToRender = searchTerm ? searchResults : services;
    if (listToRender.length && promoActivation) {
      return listToRender.map((service) => {
        const { selectedCode, isActivated } = promoActivation[service.id];
        return (
          <div className="card mb-3" key={service.id}>
            <div className="row">
              <div className="col-md-5">
                <div className="card-body">
                  <h5>{service.name}</h5>
                  <small className="card-text">{service.description}</small>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card-body">
                  <small className="small">PROMOCODE</small>
                  <div
                    className="form-control"
                    onClick={() => this.copyToClipBoard(selectedCode)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="row">
                      <div className="col-md-10">{selectedCode}</div>
                      <span className="col-md-2">
                        <i className="far fa-copy"></i>
                      </span>
                    </div>
                  </div>
                  <small
                    className="btn-link"
                    style={{ cursor: "pointer" }}
                    onClick={() => this.getAnotherCode(service)}
                  >
                    Use another code
                  </small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card-body mt-3">
                  {isActivated ? (
                    <button className="btn btn-lg btn-success">
                      Activated
                    </button>
                  ) : (
                    <button
                      className="btn btn-lg btn-primary"
                      onClick={() =>
                        this.activatePromotion(service, selectedCode)
                      }
                      disabled={activationloading}
                    >
                      Activate bonus
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      });
    }
    return <div></div>;
  };

  search = () => {
    const { services, searchTerm } = this.state;
    const results = services.filter((service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.setState({ searchResults: results });
  };

  renderSearch = () => {
    return (
      <div className="jumbotron">
        <h1 className="display-5">Services</h1>
        <small>FILTER</small>
        <div className="row">
          <div className="col-md-4">
            <input
              className="form-control"
              value={this.state.searchTerm}
              onChange={(e) =>
                this.setState(
                  { searchTerm: e.target.value },
                  _.debounce(this.search, 500)
                )
              }
            />
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-light"
              onClick={() => this.setState({ searchTerm: "" })}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    );
  };

  updatePromoActivationState = (
    service: Service,
    update: Partial<PromoActivation>
  ) => {
    const { promoActivation } = this.state;
    if (!promoActivation) {
      return;
    }
    const serviceId = service.id;
    const newPromoActivationState: PromoActivationState = {
      ...promoActivation,
      [serviceId]: {
        ...promoActivation[serviceId],
        ...update,
      },
    };
    this.setState({
      promoActivation: newPromoActivationState,
    });
  };

  render() {
    const { errorMessage, loading } = this.state;

    if (loading) {
      return <Loader />;
    }

    return (
      <div>
        {this.renderSearch()}
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}
        {this.renderServiceCards()}
      </div>
    );
  }
}
