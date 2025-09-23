import { Repository } from "typeorm";
import { PaymentRateEntity } from "../entities/paymentRate.entity.js";
import { PaymentRateDto } from "../dtos/paymentRate.dto.js";
import { dataSource } from "../../../config/database.config.js";
import { PaymentRates } from "../interfaces/paymentRate.interface.js";

export class PaymentRateService {
  private rateMappingWithoutAgent: { [key: string]: PaymentRates & { range: string } } = {
    'lessThan1M': { range: 'lessThan1M', tenantRate: 0.04, propertyAgentRate: 0.02, platformRate: 0.06 },
    '1Mto2_999M': { range: '1Mto2_999M', tenantRate: 0.038, propertyAgentRate: 0.02, platformRate: 0.058 },
    '3Mto5_999M': { range: '3Mto5_999M', tenantRate: 0.036, propertyAgentRate: 0.02, platformRate: 0.056 },
    '6MAndAbove': { range: '6MAndAbove', tenantRate: 0.034, propertyAgentRate: 0.02, platformRate: 0.054 },
  };

  private rateMappingWithAgent: { [key: string]: PaymentRates & { range: string } } = {
    'lessThan1M': { range: 'lessThan1M', tenantRate: 0.02, propertyAgentRate: 0.0125, platformRate: 0.0325 },
    '1Mto2_999M': { range: '1Mto2_999M', tenantRate: 0.018, propertyAgentRate: 0.0125, platformRate: 0.0305 },
    '3Mto5_999M': { range: '3Mto5_999M', tenantRate: 0.016, propertyAgentRate: 0.0125, platformRate: 0.0285 },
    '6MAndAbove': { range: '6MAndAbove', tenantRate: 0.014, propertyAgentRate: 0.0125, platformRate: 0.0265 },
  };

  private paymentRateRepo: Repository<PaymentRateEntity> = dataSource.getRepository(PaymentRateEntity);

  // Determines the rate range based on the amount and whether there’s an agent fee
  public getRateRange(amount: number, hasAgentFee: boolean): PaymentRates & { range: string } {
    let rangeKey: string;
    if (amount < 1_000_000) rangeKey = 'lessThan1M';
    else if (amount < 3_000_000) rangeKey = '1Mto2_999M';
    else if (amount < 6_000_000) rangeKey = '3Mto5_999M';
    else rangeKey = '6MAndAbove';

    return hasAgentFee ? this.rateMappingWithAgent[rangeKey] : this.rateMappingWithoutAgent[rangeKey];
  }

  // Splits the payment amount based on the appropriate rate mapping
  public splitPayment(amount: number, hasAgentFee: boolean) {
    const rates = this.getRateRange(amount, hasAgentFee);
    return {
      range: rates.range,
      tenantShare: amount * rates.tenantRate,
      propertyAgentShare: amount * rates.propertyAgentRate,
      platformShare: amount * rates.platformRate,
    };
  }

  // Creates a new payment rate entry in the database
  public async createRate(rateDto: PaymentRateDto): Promise<PaymentRateEntity> {
    const rate = this.paymentRateRepo.create(rateDto);
    return this.paymentRateRepo.save(rate);
  }

  // Retrieves a specific rate entry based on its range identifier
  public async getRateByRange(range: string): Promise<PaymentRateEntity | null> {
    return this.paymentRateRepo.findOneBy({ range });
  }

  // Calculates the amount after applying a specific rate
  public calculateAmountWithRate(amount: number, rate: number): number {
    return amount * rate;
  }

  // Retrieves all payment rate entries from the database
  public async getAllRates(): Promise<PaymentRateEntity[]> {
    return this.paymentRateRepo.find();
  }
}

export default PaymentRateService;
