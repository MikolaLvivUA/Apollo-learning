const { RESTDataSource } = require('apollo-datasource-rest');

class LaunchAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://api.spacexdata.com/v2/'
    }


    /*launchReducer method in order to transform our launch data into the shape our schema expects.*/
    launchReducer(launch) {
        return {
            id: launch.flight_number || 0,
            cursor: `${launch.launch_date_unix}`,
            site: launch.launch_site && launch.launch_site.site_name,
            mission: {
                name: launch.mission_name,
                missionPatchSmall: launch.links.mission_patch_small,
                missionPatchLarge: launch.links.mission_patch,
            },
            rocket: {
                id: launch.rocket.rocket_id,
                name: launch.rocket.rocket_name,
                type: launch.rocket.rocket_type,
            },
        };
    }

    async getAllLaunches() {
        const response = await this.get('launches');
        return Array.isArray(response) ? response.map(launch => this.launchReducer(launch)) : [];
    }

    async getLaunchById({ launchId }) {
        const res = await this.get('launches', { flight_number: launchId });
        return this.launchReducer(res[0]);
    }

    getLaunchesByIds({ launchIds }) {
        return Promise.all(
            launchIds.map(launchIds => this.getLaunchById({launchId}))
        );
    }

}

module.exports = LaunchAPI;