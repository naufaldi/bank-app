' use server';

import { Client } from 'dwolla-v2';

const getEnvironment = (): 'production' | 'sandbox' => {
  const env = process.env.DWOLLA_ENV as string;
  switch (env) {
    case 'production':
      return 'production';
    case 'sandbox':
      return 'sandbox';
    default:
      throw new Error(
        'Dwolla environment should either be set to `sandbox` or `production`'
      );
  }
};

const dwollaClient = new Client({
  key: process.env.DWOLLA_KEY as string,
  secret: process.env.DWOLLA_SECRET as string,
  environment: getEnvironment(),
});

// Create a Dwolla Funding Source using a Plaid Processor Token
export const createFundingSource = async (
  options: CreateFundingSourceOptions
) => {
  try {
    return await dwollaClient
      .post(`customers/${options.customerId}/funding-sources`, {
        name: options.fundingSourceName,
        plaidToken: options.plaidToken,
      })
      .then((res) => res.headers.get('location'));
  } catch (error) {
    console.log(error);
  }
};

export const createOnDemandAuthorization = async () => {
  try {
    const onDemandAuthorization = await dwollaClient.post(
      'on-demand-authorizations'
    );
    const authLink = onDemandAuthorization.body._links;
    return authLink;
  } catch (error) {
    console.log('Creating an On Demand Authorization Failed: ', error);
  }
};

export const createTransfer = async ({
  sourceFundingSourceUrl,
  destinationFundingSourceUrl,
  amount,
}: TransferParams) => {
  try {
    const requestBody = {
      _links: {
        source: {
          href: sourceFundingSourceUrl,
        },
        destination: {
          href: destinationFundingSourceUrl,
        },
      },
      amount: {
        currency: 'USD',
        value: amount,
      },
    };
    return await dwollaClient
      .post('transfers', requestBody)
      .then((res) => res.headers.get('location'));
  } catch (error) {
    console.error('Transfer fund failed: ', error);
  }
};

export const addFundingSource = async ({
  dwollaCustomerId,
  processorToken,
  bankName,
}: AddFundingSourceParams) => {
  try {
    const dwollaAuthLinks = await createOnDemandAuthorization();

    // add funding source to the dwolla customer & get the funding source url
    const fundingSourceOptions = {
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
      _links: dwollaAuthLinks,
    };
    return await createFundingSource(fundingSourceOptions);
  } catch (error) {
    console.log(error);
  }
};
