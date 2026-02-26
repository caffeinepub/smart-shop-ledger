import MixinStorage "blob-storage/Mixin";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";

actor {
  include MixinStorage();

  let premiumActivations = Map.empty<Text, Time.Time>();
  // 1 year in nanoseconds
  let oneYearNanos : Int = 365 * 24 * 60 * 60 * 1_000_000_000;

  public shared ({ caller }) func activatePremium(userId : Text) : async () {
    let currentTime = Time.now();
    premiumActivations.add(userId, currentTime);
  };

  public type PremiumStatus = {
    isActive : Bool;
    expiryDate : ?Time.Time;
  };

  public query ({ caller }) func getPremiumStatus(userId : Text) : async PremiumStatus {
    switch (premiumActivations.get(userId)) {
      case (null) {
        {
          isActive = false;
          expiryDate = null;
        };
      };
      case (?activationTime) {
        let expiryTime = activationTime + oneYearNanos;
        let currentTime = Time.now();
        if (currentTime > expiryTime) {
          {
            isActive = false;
            expiryDate = ?expiryTime;
          };
        } else {
          {
            isActive = true;
            expiryDate = ?expiryTime;
          };
        };
      };
    };
  };
};
