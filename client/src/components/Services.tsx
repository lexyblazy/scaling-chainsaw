import React from "react";
import _ from "lodash";
import * as apis from "../apis";
import {
  PromoActivationState,
  Service,
  ServicesComponentAppState,
} from "../types";
import * as utils from "../utils";
import { Loader } from "./Loader";

export class Services extends React.Component {
  state: ServicesComponentAppState = {
    services: [],
    errorMessage: "",
    loading: true,
    promoActivation: null,
    searchTerm: "",
    searchResults: [],
  };

  async componentDidMount() {
    await this.getServicesAndPromotions();
  }

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
    const serviceId = service.id;
    const newPromoActivationState: PromoActivationState = {
      ...promoActivation,
      [serviceId]: {
        ...promoActivation[serviceId],
        selectedCode: _.sample(service.promoCodes) ?? service.promoCodes[0],
      },
    };
    this.setState({
      promoActivation: newPromoActivationState,
    });
  };

  renderServiceCards = () => {
    const { services, promoActivation, searchTerm, searchResults } = this.state;
    const listToRender = searchTerm ? searchResults : services;
    if (listToRender.length && promoActivation) {
      return listToRender.map((service) => {
        const { selectedCode } = promoActivation[service.id];
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
                  <button className="btn btn-lg btn-primary">
                    Activate bonus
                  </button>
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

  render() {
    const { errorMessage, loading } = this.state;

    if (loading) {
      return <Loader />;
    }

    return (
      <div>
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}
        {this.renderSearch()}
        {this.renderServiceCards()}
      </div>
    );
  }
}
